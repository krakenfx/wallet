import type React from 'react';

import type WebView from 'react-native-webview';

import type { WebViewMessageEvent } from 'react-native-webview';

import { useCallback, useEffect, useRef, useState } from 'react';

import { postRpcMethod } from '@/api/postRpcMethod';
import { ethereumNetwork } from '@/onChain/wallets/evmNetworks';

import { useTokens } from '@/realm/tokens';
import { useRealmWalletById } from '@/realm/wallets';
import { useReceiveAddress } from '@/screens/Receive/hooks';

import { useDappSignRequests } from '../hooks/useDappSignRequests';
import { type PageInfo, RpcMethods, WalletRequestMethods } from '../types';
import { getHexValue, getTokenByChainId } from '../utils';

const DEFAULT_CHAIN_ID = getHexValue(ethereumNetwork.chainId); 

export const useDappMethods = (webviewRef: React.RefObject<WebView>) => {
  const [currentChainId, setCurrentChainId] = useState(DEFAULT_CHAIN_ID);

  const isConnected = useRef(false);

  const tokens = useTokens();
  const selectedToken = getTokenByChainId(tokens, currentChainId);
  const walletId = selectedToken?.walletId || ''; 
  const wallet = useRealmWalletById(walletId);
  const address = useReceiveAddress(wallet);
  const [pageInfo, setPageInfo] = useState<PageInfo>({ icon: '', url: '' });

  const { signMessage, signTransaction } = useDappSignRequests(wallet, pageInfo);

  const postMessage = useCallback(
    ({ result, id, method }: { result: unknown; id?: string; method?: string }) => {
      
      if (webviewRef.current) {
        webviewRef.current.postMessage(
          JSON.stringify({
            id,
            result,
            method,
          }),
        );
      }
    },
    [webviewRef],
  );

  useEffect(() => {
    postMessage({
      
      method: 'chainChanged',
      result: currentChainId,
    });
  }, [currentChainId, postMessage]);

  const onMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      const accounts = [address];
      let payload;
      try {
        payload = JSON.parse(event.nativeEvent.data);
      } catch (e) {
        console.error('Failed parsing webview message');
        return;
      }
      const { method, params, id } = payload;

      console.log('--------------------------');
      console.log('--- request ', method, id);
      console.log('--- params ', params);

      switch (method) {
        case RpcMethods.eth_accounts:
        case RpcMethods.eth_requestAccounts: {
          postMessage({
            id,
            result: accounts,
          });
          if (!isConnected.current) {
            isConnected.current = true;
            postMessage({
              method: 'connect',
              result: { chainId: currentChainId },
            });
          }

          break;
        }
        case RpcMethods.eth_chainId: {
          postMessage({
            id,
            result: currentChainId,
          });
          break;
        }
        case RpcMethods.eth_sendTransaction: {
          try {
            const signedTransaction = await signTransaction(method, params);
            postMessage({
              id,
              result: signedTransaction,
            });
          } catch (e) {
            
            console.error(e);
          }

          break;
        }
        case WalletRequestMethods.wallet_requestPermissions: {
          postMessage({
            id,
            result: accounts, 
          });
          break;
        }
        case RpcMethods.personal_sign:
        case RpcMethods.eth_signTypedData_v4:
        case RpcMethods.eth_signTypedData_v3: {
          try {
            const signature = await signMessage(method, params);
            postMessage({
              id,
              result: signature,
            });
          } catch (e) {
            
            console.error(e);
          }

          break;
        }
        case WalletRequestMethods.wallet_switchEthereumChain: {
          const chainId = params[0]?.chainId;
          const token = getTokenByChainId(tokens, chainId);
          if (token) {
            setCurrentChainId(chainId);
            postMessage({
              id,
              result: {},
            });
          } else {
            postMessage({
              result: {
                code: 4902, 
                message: 'Unrecognized chain ID',
              },
              id,
            });
          }

          break;
        }
        case WalletRequestMethods.wallet_revokePermissions: {
          
          postMessage({ result: {}, id });
          break;
        }
        case WalletRequestMethods.wallet_getCapabilities: {
          postMessage({
            result: [Object.values(RpcMethods)],
            id,
          });
          break;
        }
        case 'wallet-get-page-info': {
          setPageInfo({
            icon: params[0],
            url: params[1],
          });
          break;
        }
        default: {
          try {
            postMessage({
              id,
              result: await postRpcMethod(wallet, method, params),
            });
          } catch (e) {
            console.error(e);
          }
        }
      }
    },
    [address, postMessage, currentChainId, signTransaction, signMessage, tokens, wallet],
  );
  return {
    onMessage,
  };
};
