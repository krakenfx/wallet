import { omit } from 'lodash';
import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ZodError } from 'zod';

import { proxyRpcRequest } from '@/api/proxyRpcRequest';
import { ethereumNetwork } from '@/onChain/wallets/evmNetworks';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import { useDappPermissionMutations, useDappPermissions } from '@/realm/dappIntegration';
import { type RealmWallet, useRealmWallets } from '@/realm/wallets';
import { useBrowserContext } from '@/screens/Browser/context/BrowserContext';

import { EvmRpcMethod, EvmWalletMethod, SolanaRpcMethod, defaultEvmChainIdByDomain } from '../constants.ts';
import { evmWalletRequestPermissionsSchema, evmWalletSwitchEthereumChainSchema, solSignMessageParamsSchema, solSignTransactionsParamsSchema } from '../schemas';
import { getEvmCaipId, getHexValue, shouldAllowWithoutPermission, signRequest } from '../utils';

import { useConnectDappModal } from './useConnectDappModal';

import { useDappSignRequests } from './useDappSignRequests';
import { useSolanaSignRequests } from './useSolanaSignRequests';

import type {
  PageInfo,
  PostPageInfoWebViewRequest,
  RequestPermissionsResult,
  RequestRevokePermissionsParams,
  RpcRequest,
  RpcRequestWebViewRequest,
  RpcResponse,
  SignedWebViewRequest,
  WebViewEvent,
  WebViewResponse,
} from '../types';
import type { WebView, WebViewMessageEvent } from '@metamask/react-native-webview';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';
import { performActionAndBlockWalletConnectEvents } from '/modules/wallet-connect/appRequestQueue';

export const useDappMethods = (webViewRef: RefObject<WebView>, secret: string) => {
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  const { cleanUrl: domain, baseUrl } = useBrowserContext();

  const hasPermissions = useDappPermissions(domain);
  const hasPermissionsRef = useRef(hasPermissions);

  useEffect(() => {
    hasPermissionsRef.current = hasPermissions;
  }, [hasPermissions]);

  const [evmChainId, setEvmChainId] = useState(ethereumNetwork.chainId);

  useEffect(() => {
    if (domain !== null && domain in defaultEvmChainIdByDomain) {
      setEvmChainId(defaultEvmChainIdByDomain[domain]);
    }
  }, [domain]);

  const realmWallets = useRealmWallets();
  const { evmWallets, solanaWallet } = useMemo(() => {
    const evmWallets = realmWallets.filtered('caipId BEGINSWITH $0', 'eip155:');

    if (evmWallets.length === 0) {
      throw new Error('Could not find EVM-compatible wallets');
    }

    const solanaWallets = realmWallets.filtered('caipId = $0', ChainAgnostic.NETWORK_SOLANA);

    if (solanaWallets.length === 0) {
      throw new Error('Could not find a Solana-compatible wallet');
    }

    return {
      evmWallets,
      solanaWallet: solanaWallets[0],
    };
  }, [realmWallets]);
  const getAddress = useCallback((wallet: RealmWallet) => {
    const { network } = getImplForWallet(wallet);

    return network.deriveAddress(wallet);
  }, []);
  const isSupportedEvmChainId = useCallback(
    (evmChainId: number) => {
      return evmWallets.some(evmWallet => evmWallet.caipId === getEvmCaipId(evmChainId));
    },
    [evmWallets],
  );
  const evmCaipId = useMemo(() => getEvmCaipId(evmChainId), [evmChainId]);
  const evmWallet = useMemo(() => {
    return evmWallets.filtered('caipId = $0', evmCaipId)[0];
  }, [evmWallets, evmCaipId]);

  const { signEvmMessage, signEvmTransaction, signAndSendEvmTransaction } = useDappSignRequests(evmWallet, pageInfo);
  const { openModal: openConnectModal } = useConnectDappModal();
  const { revokePermissions, savePermission } = useDappPermissionMutations();
  const { signSolanaMessage, signSolanaTransaction, signAndSendSolanaTransaction } = useSolanaSignRequests();

  const postMessage = useCallback(
    (responseOrEvent: WebViewResponse | WebViewEvent) => {
      const isEvent = 'network' in responseOrEvent;

      console.log(`<-- sent ${isEvent ? 'event' : 'response'}`);
      console.log('<--', responseOrEvent);
      console.log('<--------');

      if (webViewRef.current) {
        const responseString = JSON.stringify(responseOrEvent);

        webViewRef.current.postMessage(responseString);
      }
    },
    [webViewRef],
  );
  const respond = useCallback((requestId: string, result: RpcResponse = {}) => postMessage({ id: requestId, result }), [postMessage]);
  const decline = useCallback(
    (requestId: string, message?: string, code?: number) =>
      respond(requestId, { error: { code: code ?? 4001, message: message ?? loc.appSignRequest.declinedRequest } }),
    [respond],
  );

  const handlePostPageInfoRequest = useCallback((request: PostPageInfoWebViewRequest) => {
    setPageInfo(request.context);
  }, []);

  const handlePermissionsRequest = useCallback(
    async (params: RequestRevokePermissionsParams) => {
      const result: RequestPermissionsResult = [];

      if (domain === null || baseUrl === null) {
        return result;
      }

      if ('eth_accounts' in params[0]) {
        const method = 'eth_accounts';
        const permission = {
          parentCapability: method as EvmRpcMethod,
        };

        if (!hasPermissionsRef.current) {
          try {
            await performActionAndBlockWalletConnectEvents(() => openConnectModal(evmWallet, pageInfo, domain, baseUrl));
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
    [domain, baseUrl, savePermission, openConnectModal, pageInfo, evmWallet],
  );

  const evmDisconnect = useCallback(() => {
    const args = [{ code: 4900, message: 'Wallet is disconnected from all chains' }];
    const disconnectEvent: WebViewEvent = { network: 'evm', name: 'disconnect', args };
    const closeEvent: WebViewEvent = { network: 'evm', name: 'close', args };

    postMessage(disconnectEvent);
    postMessage(closeEvent);
  }, [postMessage]);

  const solanaDisconnect = useCallback(() => {
    const disconnectEvent: WebViewEvent = { network: 'solana', name: 'disconnect', args: [] };

    postMessage(disconnectEvent);
  }, [postMessage]);

  const handleEvmRpcRequest = useCallback(
    async (requestId: string, request: RpcRequest) => {
      if (domain === null || baseUrl === null) {
        throw new Error('domain or baseUrl is undefined');
      }

      if (!shouldAllowWithoutPermission(request.method) && !hasPermissionsRef.current) {
        return decline(requestId, loc.errors.permissionDenied);
      }

      switch (request.method) {
        case EvmWalletMethod.wallet_requestPermissions: {
          try {
            const parsedParams = evmWalletRequestPermissionsSchema.parse(request.params);
            const result = await handlePermissionsRequest(parsedParams);

            if (result.length === 0) {
              return decline(requestId);
            }

            respond(requestId, { result });
            break;
          } catch (error) {
            if (error instanceof ZodError) {
              return decline(requestId, loc.formatString(loc.errors.invalidRequest, { method: request.method.toString() }).toString(), -32000);
            }

            throw error;
          }
        }

        case EvmWalletMethod.wallet_revokePermissions: {
          revokePermissions(domain);
          respond(requestId, { result: null });
          evmDisconnect();
          break;
        }

        case EvmWalletMethod.wallet_getPermissions: {
          respond(requestId, { result: [{ parentCapability: EvmRpcMethod.eth_accounts }] });
          break;
        }

        case EvmWalletMethod.wallet_switchEthereumChain: {
          try {
            const parsedParams = evmWalletSwitchEthereumChainSchema.parse(request.params);
            const newEvmChainId = parseInt(parsedParams[0].chainId, 16);

            if (!isSupportedEvmChainId(newEvmChainId)) {
              return decline(requestId, loc.errors.unsupportedChain, 4901);
            }

            setEvmChainId(newEvmChainId);
            respond(requestId, { result: null });
            postMessage({
              network: 'evm',
              name: 'chainChanged',
              args: [newEvmChainId],
            });
            return postMessage({
              network: 'evm',
              name: 'networkChanged',
              args: [newEvmChainId],
            });
          } catch (error) {
            if (error instanceof ZodError) {
              return decline(requestId, loc.formatString(loc.errors.invalidRequest, { method: request.method.toString() }).toString(), -32000);
            }

            throw error;
          }
        }

        case EvmRpcMethod.eth_requestAccounts: {
          if (!hasPermissionsRef.current) {
            const result = await handlePermissionsRequest([{ [EvmRpcMethod.eth_accounts]: {} }]);

            if (result.length === 0) {
              return decline(requestId, loc.errors.permissionDenied, 4100);
            }
          }

          const evmAddress = await getAddress(evmWallet);

          respond(requestId, { result: [evmAddress] });
          postMessage({
            network: 'evm',
            name: 'connect',
            args: [{ chainId: getHexValue(evmChainId) }],
          });
          return postMessage({
            network: 'evm',
            name: 'accountsChanged',
            args: [evmAddress],
          });
        }

        case EvmRpcMethod.eth_accounts: {
          if (!hasPermissionsRef.current) {
            return respond(requestId, { result: [] });
          }

          const evmAddress = await getAddress(evmWallet);

          return respond(requestId, { result: [evmAddress] });
        }

        case EvmRpcMethod.eth_chainId:
          return respond(requestId, { result: getHexValue(evmChainId) });

        case EvmRpcMethod.personal_sign:
        case EvmRpcMethod.eth_signTypedData:
        case EvmRpcMethod.eth_signTypedData_v1:
        case EvmRpcMethod.eth_signTypedData_v3:
        case EvmRpcMethod.eth_signTypedData_v4: {
          try {
            const signature = await performActionAndBlockWalletConnectEvents(() =>
              signEvmMessage(request.method as EvmRpcMethod, request.params as unknown[], domain, baseUrl),
            );

            if (!signature) {
              return decline(requestId);
            }

            return respond(requestId, { result: signature });
          } catch (error) {
            handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
            return decline(requestId, loc.errors.generic);
          }
        }

        case EvmRpcMethod.eth_signTransaction: {
          try {
            const signature = await performActionAndBlockWalletConnectEvents(() =>
              signEvmTransaction(request.method as EvmRpcMethod, request.params as unknown[], domain, baseUrl),
            );

            if (signature === undefined) {
              return decline(requestId);
            }

            return respond(requestId, { result: signature });
          } catch (error) {
            handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
            return decline(requestId, loc.errors.generic);
          }
        }

        case EvmRpcMethod.eth_sendTransaction: {
          try {
            const signature = await performActionAndBlockWalletConnectEvents(() =>
              signAndSendEvmTransaction(request.method as EvmRpcMethod, request.params as unknown[], domain, baseUrl),
            );

            if (signature === undefined) {
              return decline(requestId);
            }

            return respond(requestId, { result: signature });
          } catch (error) {
            handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
            return decline(requestId, loc.errors.generic);
          }
        }

        default: {
          if (request.method in EvmRpcMethod) {
            const response = await proxyRpcRequest(evmCaipId, request.method, request.params, request.id);

            return respond(requestId, omit(response, ['jsonrpc']));
          }

          return decline(requestId, `Unsupported method "${request.method}"`, 4200);
        }
      }
    },
    [
      domain,
      baseUrl,
      decline,
      respond,
      evmChainId,
      handlePermissionsRequest,
      evmDisconnect,
      revokePermissions,
      signEvmMessage,
      signEvmTransaction,
      signAndSendEvmTransaction,
      evmCaipId,
      evmWallet,
      isSupportedEvmChainId,
      getAddress,
      postMessage,
    ],
  );

  const handleSolanaRpcRequest = useCallback(
    async (requestId: string, request: RpcRequest) => {
      if (domain === null || baseUrl === null) {
        throw new Error('domain or baseUrl is not defined');
      }

      if (!shouldAllowWithoutPermission(request.method) && !hasPermissionsRef.current) {
        return decline(requestId, loc.errors.permissionDenied);
      }

      switch (request.method) {
        case SolanaRpcMethod.sol_connect: {
          if (!hasPermissionsRef.current) {
            try {
              await performActionAndBlockWalletConnectEvents(() => openConnectModal(solanaWallet, pageInfo, domain, baseUrl));
              savePermission(domain);
            } catch (error) {
              if (error === false) {
                return decline(requestId);
              }

              throw error;
            }
          }

          const address = await getAddress(solanaWallet);
          const connectEvent: WebViewEvent = { network: 'solana', name: 'connect', args: [address] };

          postMessage(connectEvent);
          return respond(requestId, { result: address });
        }

        case SolanaRpcMethod.sol_disconnect: {
          revokePermissions(domain);
          solanaDisconnect();
          return respond(requestId);
        }

        case SolanaRpcMethod.sol_signMessage: {
          const address = await getAddress(solanaWallet);

          try {
            const parsedParams = solSignMessageParamsSchema.parse(request.params);
            const signature = await signSolanaMessage({
              wallet: solanaWallet,
              pageInfo,
              domain,
              baseUrl,
              message: parsedParams[0],
              address,
            });

            if (signature === null) {
              return decline(requestId);
            }

            return respond(requestId, { result: { signature, publicKey: address } });
          } catch (error) {
            if (error instanceof ZodError) {
              return decline(requestId, loc.formatString(loc.errors.invalidRequest, { method: request.method }).toString(), -32000);
            }

            handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
            return decline(requestId, loc.errors.generic);
          }
        }

        case SolanaRpcMethod.sol_signTransactions: {
          const address = await getAddress(solanaWallet);

          try {
            const parsedParams = solSignTransactionsParamsSchema.parse(request.params);
            const signedTransactions = await signSolanaTransaction({
              wallet: solanaWallet,
              pageInfo,
              domain,
              baseUrl,
              params: parsedParams,
              address,
              method: request.method,
            });

            if (signedTransactions === null) {
              return decline(requestId);
            }

            return respond(requestId, { result: signedTransactions.map(t => Buffer.from(t, 'base64').toString('hex')) });
          } catch (error) {
            if (error instanceof ZodError) {
              return decline(requestId, loc.formatString(loc.errors.invalidRequest, { method: request.method }).toString(), -32000);
            }

            handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
            return decline(requestId, loc.errors.generic);
          }
        }

        case SolanaRpcMethod.sol_signAndSendTransactions: {
          const address = await getAddress(solanaWallet);

          try {
            const parsedParams = solSignTransactionsParamsSchema.parse(request.params);
            const signatures = await signAndSendSolanaTransaction({
              wallet: solanaWallet,
              pageInfo,
              domain,
              baseUrl,
              params: parsedParams,
              address,
              method: request.method,
            });

            if (signatures === null) {
              return decline(requestId);
            }

            return respond(requestId, {
              result: signatures.map(signature => ({
                publicKey: address,
                signature,
              })),
            });
          } catch (error) {
            if (error instanceof ZodError) {
              return decline(requestId, loc.formatString(loc.errors.invalidRequest, { method: request.method }).toString(), -32000);
            }

            handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
            return decline(requestId, loc.errors.generic);
          }
        }
      }
    },
    [
      respond,
      postMessage,
      getAddress,
      solanaWallet,
      signSolanaMessage,
      signSolanaTransaction,
      signAndSendSolanaTransaction,
      domain,
      baseUrl,
      pageInfo,
      decline,
      openConnectModal,
      savePermission,
      solanaDisconnect,
      revokePermissions,
    ],
  );

  const requestQueueRef = useRef<RpcRequestWebViewRequest[]>([]);

  useEffect(() => {
    requestQueueRef.current = [];
  }, [domain]);

  const handleRpcRequest = useCallback(
    (request: RpcRequestWebViewRequest) => {
      console.log('--> received an RPC request');
      console.log('--> id:', request.id);
      console.log('--> method:', request.context.method);
      console.log('--> params:', request.context.params);
      console.log('-------->');

      switch (request.context.network) {
        case 'evm':
          return handleEvmRpcRequest(request.id, request.context);

        case 'solana':
          return handleSolanaRpcRequest(request.id, request.context);
      }
    },
    [handleEvmRpcRequest, handleSolanaRpcRequest],
  );

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      let message: SignedWebViewRequest;

      try {
        message = JSON.parse(event.nativeEvent.data);
      } catch {
        return;
      }

      const signature = signRequest(secret, message);

      if (signature !== message.signature) {
        return postMessage({ id: message.id, error: loc.errors.unauthorizedRequest });
      }

      switch (message.method) {
        case 'log':
          console.log('BROWSER LOG', message.context.message);
          break;

        case 'post_page_info':
          return handlePostPageInfoRequest(message);

        case 'rpc_request': {
          requestQueueRef.current.push(message);
        }
      }
    },
    [secret, postMessage, handlePostPageInfoRequest],
  );

  const processRequestQueue = useCallback(
    async (context: { mounted: boolean }) => {
      if (requestQueueRef.current.length > 0) {
        const request = requestQueueRef.current.shift()!;

        try {
          await handleRpcRequest(request);
        } catch (error) {
          handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
          decline(request.id, loc.errors.generic, -32603);
          evmDisconnect();
          solanaDisconnect();
        }
      }

      if (context.mounted) {
        setTimeout(processRequestQueue, 250, context);
      }
    },
    [handleRpcRequest, decline, evmDisconnect, solanaDisconnect],
  );

  const memoizedProcessRequestQueue = useCallback(processRequestQueue, [handleRpcRequest, processRequestQueue]);

  const manualDisconnect = useCallback(() => {
    if (domain !== null) {
      revokePermissions(domain);
      evmDisconnect();
      solanaDisconnect();
    }
  }, [domain, evmDisconnect, solanaDisconnect, revokePermissions]);

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
      disconnect: manualDisconnect,
    }),
    [onMessage, manualDisconnect],
  );
};
