import type React from 'react';

import type WebView from 'react-native-webview';

import { omit } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { type WebViewMessageEvent } from 'react-native-webview';

import { proxyRpcRequest } from '@/api/proxyRpcRequest';

import { getImplForWallet } from '@/onChain/wallets/registry';
import { useDappPermissions } from '@/realm/dappIntegration';
import { useDappPermissionMutations } from '@/realm/dappIntegration/useDappPermissionMutations';
import { useTokens } from '@/realm/tokens';
import { useRealmWalletById } from '@/realm/wallets';
import { useBrowserContext } from '@/screens/Browser/context/BrowserContext';
import { useReceiveAddress } from '@/screens/Receive/hooks';

import { defaultChainIdByDomain, ethereumChainId } from '../constants.ts';
import { useConnectDappModal } from '../hooks/useConnectDappModal';
import { useDappSignRequests } from '../hooks/useDappSignRequests';

import {
  type GetPageInfoWebViewRequest,
  type PageInfo,
  type RequestPermissionsResult,
  type RequestRevokePermissionsParams,
  RpcMethod,
  type RpcRequestWebViewRequest,
  type SwitchEthereumChainParams,
  WalletMethod,
  type WebViewEvent,
  type WebViewRequest,
  type WebViewResponse,
} from '../types';
import { getTokenByChainId, requiresUserInteraction, signRequest } from '../utils';

import { handleError } from '/helpers/errorHandler';

export const useDappMethods = (webViewRef: React.RefObject<WebView>, secret: string) => {
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const { cleanUrl: domain, baseUrl } = useBrowserContext();

  const hasPermissions = useDappPermissions(domain);
  const hasPermissionsRef = useRef(hasPermissions);

  useEffect(() => {
    hasPermissionsRef.current = hasPermissions;
  }, [hasPermissions]);

  const [chainId, setChainId] = useState(ethereumChainId);

  useEffect(() => {
    if (domain !== null) {
      setChainId(defaultChainIdByDomain[domain] ?? ethereumChainId);
    }
  }, [domain]);

  const tokens = useTokens();

  const tokenByChainId = getTokenByChainId(tokens, chainId)!;
  const wallet = useRealmWalletById(tokenByChainId.walletId);
  const receiveAddress = useReceiveAddress(wallet);
  const evmAccounts = useMemo(() => [receiveAddress], [receiveAddress]);
  const network = useMemo(() => {
    const { network } = getImplForWallet(wallet);

    return network.caipId;
  }, [wallet]);

  const { signEvmMessage, signEvmTransaction, signAndSendEvmTransaction } = useDappSignRequests(wallet, pageInfo);
  const { openModal: openConnectModal } = useConnectDappModal();
  const { revokePermissions, savePermission } = useDappPermissionMutations();

  const postMessage = useCallback(
    <Result>(response: WebViewResponse<Result> | WebViewEvent) => {
      console.log('<-- sent response');
      console.log('<--', response);
      console.log('<----------------');

      if (webViewRef.current) {
        const responseString = JSON.stringify(response);

        webViewRef.current.postMessage(responseString);
      }
    },
    [webViewRef],
  );
  const respond = useCallback(<Result>(requestId: string, result?: Result) => postMessage<Result>({ id: requestId, result }), [postMessage]);
  const decline = useCallback(
    (requestId: string, message?: string, code?: number) =>
      respond(requestId, { error: { code: code ?? 4001, message: message ?? 'User declined the request' } }),
    [respond],
  );

  const handleGetPageInfoRequest = useCallback(
    (request: GetPageInfoWebViewRequest) => {
      setPageInfo(request.context);
      respond(request.id);
    },
    [respond],
  );

  const handlePermissionsRequest = useCallback(
    async (params: RequestRevokePermissionsParams) => {
      const result: RequestPermissionsResult = [];

      if (domain === null || baseUrl === null) {
        return result;
      }

      if ('eth_accounts' in params[0]) {
        const method = 'eth_accounts';
        const permission = {
          parentCapability: method as RpcMethod,
        };

        if (!hasPermissionsRef.current) {
          try {
            await openConnectModal(pageInfo, domain, baseUrl);
            savePermission(domain);
            result.push(permission);
          } catch {
            return result;
          }
        } else {
          result.push(permission);
        }
      }

      return result;
    },
    [domain, baseUrl, openConnectModal, pageInfo, savePermission],
  );

  const disconnect = useCallback(() => {
    const disconnetEvent: WebViewEvent = { event: 'disconnect', data: [{ code: 4900, message: 'Wallet is disconnected from all chains' }] };
    const closeEvent: WebViewEvent = { event: 'close', data: [{ code: 4900, message: 'Wallet is disconnected from all chains' }] };

    postMessage(disconnetEvent);
    postMessage(closeEvent);
  }, [postMessage]);

  const handleEvmRpcRequest = useCallback(
    async (request: RpcRequestWebViewRequest) => {
      console.log('--> received an EVM RPC request');
      console.log('--> id:', request.id);
      console.log('--> method:', request.context.method);
      console.log('--> params:', request.context.params);
      console.log('------------------------------>');

      if (domain === null || baseUrl === null) {
        return decline(request.id, 'Unexpected error', 4900);
      }

      switch (request.context.method) {
        case WalletMethod.wallet_requestPermissions: {
          const params = request.context.params as RequestRevokePermissionsParams;
          const result = await handlePermissionsRequest(params);

          if (result.length === 0) {
            return decline(request.id);
          }

          respond(request.id, { result });
          break;
        }

        case WalletMethod.wallet_revokePermissions: {
          if (pageInfo) {
            revokePermissions(domain);
          }
          respond(request.id, { result: null });
          disconnect();
          break;
        }

        case WalletMethod.wallet_getPermissions: {
          if (hasPermissions) {
            respond(request.id, { result: [{ parentCapability: RpcMethod.eth_accounts }] });
          }
          break;
        }

        case WalletMethod.wallet_switchEthereumChain: {
          const params = request.context.params as SwitchEthereumChainParams;
          const token = getTokenByChainId(tokens, params[0].chainId);

          if (token === null) {
            return decline(request.id, 'Wallet does not support the requested chain', 4901);
          }

          setChainId(params[0].chainId);
          return respond(request.id, { result: null });
        }

        case RpcMethod.eth_requestAccounts: {
          if (!hasPermissionsRef.current) {
            const result = await handlePermissionsRequest([{ [RpcMethod.eth_accounts]: {} }]);

            if (result.length === 0) {
              return decline(request.id, 'Permission denied');
            }
          }

          return respond(request.id, { result: evmAccounts });
        }

        case RpcMethod.eth_accounts: {
          if (!hasPermissions) {
            return respond(request.id, { result: [] });
          }

          return respond(request.id, { result: evmAccounts });
        }

        case RpcMethod.eth_chainId:
          return respond(request.id, { result: chainId });

        case RpcMethod.personal_sign:
        case RpcMethod.eth_signTypedData:
        case RpcMethod.eth_signTypedData_v1:
        case RpcMethod.eth_signTypedData_v3:
        case RpcMethod.eth_signTypedData_v4: {
          const signature = await signEvmMessage(request.context.method, request.context.params as unknown[], domain, baseUrl);

          if (!signature) {
            return decline(request.id);
          }

          return respond(request.id, { result: signature });
        }

        case RpcMethod.eth_signTransaction: {
          try {
            const signature = await signEvmTransaction(request.context.method, request.context.params as unknown[], domain, baseUrl);

            if (signature === undefined) {
              return decline(request.id);
            }

            return respond(request.id, { result: signature });
          } catch (error) {
            handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
            return decline(request.id);
          }
        }

        case RpcMethod.eth_sendTransaction: {
          try {
            const signature = await signAndSendEvmTransaction(request.context.method, request.context.params as unknown[], domain, baseUrl);

            if (signature === undefined) {
              return decline(request.id);
            }

            return respond(request.id, { result: signature });
          } catch (error) {
            handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
            return decline(request.id);
          }
        }

        default: {
          if (request.context.method in RpcMethod) {
            const response = await proxyRpcRequest(network, request.context.method, request.context.params, request.context.id);

            return respond(request.id, omit(response, ['jsonrpc']));
          }

          return decline(request.id, `Unsupported method "${request.context.method}"`, 4200);
        }
      }
    },
    [
      decline,
      respond,
      chainId,
      handlePermissionsRequest,
      pageInfo,
      disconnect,
      revokePermissions,
      tokens,
      evmAccounts,
      signEvmMessage,
      signEvmTransaction,
      signAndSendEvmTransaction,
      network,
      domain,
      baseUrl,
      hasPermissions,
    ],
  );

  const requestQueueRef = useRef<RpcRequestWebViewRequest[]>([]);

  const handleRpcRequest = useCallback(
    (request: RpcRequestWebViewRequest) => {
      switch (request.context.network) {
        case 'evm':
          return handleEvmRpcRequest(request);

        case 'solana':
          return;
      }
    },
    [handleEvmRpcRequest],
  );

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      let message: WebViewRequest;

      try {
        message = JSON.parse(event.nativeEvent.data);
      } catch {
        return;
      }

      const signature = signRequest(secret, message);

      if (signature !== message.signature) {
        return respond(message.id, { error: 'Unauthorized request' });
      }

      try {
        switch (message.method) {
          case 'log':
            console.log('BROWSER LOG', message.context.message);
            respond(message.id);
            break;

          case 'get_page_info':
            return handleGetPageInfoRequest(message);

          case 'rpc_request': {
            if (requiresUserInteraction(message.context.method)) {
              requestQueueRef.current.push(message);
              return;
            }

            return handleRpcRequest(message);
          }
        }
      } catch (error) {
        handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
        decline(message.id, 'Unexpected error', 4900);
        disconnect();
      }
    },
    [secret, respond, handleGetPageInfoRequest, handleRpcRequest, decline, disconnect],
  );

  const processRequestQueue = useCallback(
    async (context: { mounted: boolean }) => {
      if (requestQueueRef.current.length > 0) {
        const request = requestQueueRef.current.shift()!;

        await handleRpcRequest(request);
      }

      if (context.mounted) {
        setTimeout(processRequestQueue, 250, context);
      }
    },
    [handleRpcRequest],
  );

  const memoizedProcessRequestQueue = useCallback(processRequestQueue, [handleRpcRequest, processRequestQueue]);

  useEffect(() => {
    if (hasPermissions) {
      postMessage({
        event: 'connect',
        data: [{ chainId }],
      });
    }
  }, [hasPermissions, postMessage, chainId]);

  useEffect(() => {
    if (hasPermissions) {
      postMessage({
        event: 'accountsChanged',
        data: [evmAccounts],
      });
    }
  }, [hasPermissions, postMessage, evmAccounts]);

  useEffect(() => {
    if (hasPermissions) {
      postMessage({
        event: 'chainChanged',
        data: [chainId],
      });
      postMessage({
        event: 'networkChanged',
        data: [chainId],
      });
    }
  }, [hasPermissions, postMessage, chainId]);

  useEffect(() => {
    const context = { mounted: true };

    memoizedProcessRequestQueue(context);
    return () => {
      context.mounted = false;
    };
  }, [memoizedProcessRequestQueue]);

  return useMemo(
    () => ({
      onMessage,
      disconnect,
    }),
    [onMessage, disconnect],
  );
};
