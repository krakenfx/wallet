import type { Platform } from 'react-native';

import {
  type ProviderRpcError,
  RpcMethod,
  type RpcRequest,
  type RpcRequestWebViewRequestContext,
  type RpcResponse,
  type WebViewEvent,
  type WebViewRequest,
  type WebViewResponse,
} from '@/dAppIntegration/types.ts';

type EventListener = (...args: unknown[]) => void;

interface Provider {
  _wrappedListeners: Map<EventListener, (event: Event) => ReturnType<EventListener>>;
  _eventNames: Set<string>;

  on: (eventName: string, listener: EventListener) => Provider;
  removeListener: (eventName: string, listener: EventListener) => Provider;
  rpcRequest: <Result>(rpcRequest: RpcRequestWebViewRequestContext) => Promise<Result>;
  removeAllListeners: () => Provider;
}

type SendCallback = (error: ProviderRpcError | null, result: RpcResponse | null) => void;

interface EvmProvider extends Provider {
  isMetaMask: true;
  isKrakenWallet: boolean;
  _isConnected: boolean;
  _metamask: {
    isUnlocked: () => Promise<true>;
  };

  request: (rpcRequest: RpcRequest) => Promise<unknown>;
  sendAsync: (rpcRequest: RpcRequest, callback: SendCallback) => void;
  send: (requestOrMethod: RpcRequest | RpcRequest['method'], callbackOrParams: SendCallback | RpcRequest['params']) => void;
  enable: () => Promise<unknown>;
  isConnected: () => boolean;
}

declare global {
  interface Window {
    ethereum: EvmProvider;
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
  }
}

function injectProviders(secret: string, platform: typeof Platform.OS) {
  'show source';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requests = new Map<string, { resolve: (result: any) => void; reject: (error: string) => void }>();

  const onMessage = (event: MessageEvent | Event) => {
    try {
      if (!(event instanceof MessageEvent)) {
        return;
      }

      const messageString = event.data;
      const message = JSON.parse(messageString) as WebViewResponse<unknown> | WebViewEvent;

      if ('event' in message) {
        window.dispatchEvent(
          new CustomEvent(`_krakenWallet:${message.event}`, {
            detail: { data: message.data },
          }),
        );

        return;
      }

      if (requests.has(message.id)) {
        const { resolve, reject } = requests.get(message.id)!;

        if (message.error !== undefined) {
          reject(message.error);
        } else {
          resolve(message.result);
        }

        requests.delete(message.id);
      }
    } catch (error) {}
  };

  if (platform === 'ios') {
    window.addEventListener('message', onMessage);
  } else {
    document.addEventListener('message', onMessage);
  }

  const encoder = new TextEncoder();

  function signRequest(request: Omit<WebViewRequest, 'signature'>) {
    const requestString = JSON.stringify(request);
    const requestBuffer = encoder.encode(requestString);
    const secretBuffer = encoder.encode(secret);
    const algorithm = { name: 'HMAC', hash: { name: 'SHA-256' } };

    return window.crypto.subtle
      .importKey('raw', secretBuffer, algorithm, false, ['sign'])
      .then(key => window.crypto.subtle.sign(algorithm, key, requestBuffer))
      .then(signatureBuffer =>
        Array.from(new Uint8Array(signatureBuffer))
          .map(byte => byte.toString(16).padStart(2, '0'))
          .join(''),
      );
  }

  function request<Result>(requestWithoutId: Omit<WebViewRequest, 'id' | 'signature'>) {
    const requestId = window.crypto.randomUUID();
    const request = {
      id: requestId,
      ...requestWithoutId,
    };

    return signRequest(request).then(
      signature =>
        new Promise<Result>((resolve, reject) => {
          const requestString = JSON.stringify({
            ...request,
            signature,
          });

          requests.set(requestId, { resolve, reject });
          window.ReactNativeWebView.postMessage(requestString);
        }),
    );
  }

  function log(message: string) {
    return request({
      method: 'log',
      context: { message },
    });
  }

  function postPageInfo() {
    const metaTag = document.querySelector<HTMLLinkElement>('meta[name="apple-mobile-web-app-title"]');
    const linkTag = document.querySelector<HTMLLinkElement>('link[rel="icon"]') ?? document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]');

    return request({
      method: 'get_page_info',
      context: {
        iconUrl: linkTag?.href,
        title: metaTag?.getAttribute('content') ?? undefined,
      },
    });
  }

  postPageInfo();

  function assert(condition: boolean, message: string): asserts condition {
    if (!condition) {
      throw new Error(message);
    }
  }

  const provider: Provider = {
    _wrappedListeners: new Map<EventListener, (event: Event) => ReturnType<EventListener>>(),
    _eventNames: new Set<string>(),

    on: (eventName: string, listener: EventListener) => {
      provider._eventNames.add(eventName);

      const wrappedListener = (event: Event) => {
        assert(event instanceof CustomEvent, 'Listener should only be called with a CustomEvent');
        return listener(...event.detail.data);
      };

      provider._wrappedListeners.set(listener, wrappedListener);
      window.addEventListener(`_krakenWallet:${eventName}`, wrappedListener);
      return provider;
    },
    removeListener: (event: string, listener: EventListener) => {
      if (!provider._wrappedListeners.has(listener)) {
        return provider;
      }

      const wrappedListener = provider._wrappedListeners.get(listener)!;

      window.removeEventListener(`_krakenWallet:${event}`, wrappedListener);
      return provider;
    },

    rpcRequest: <Result>({ method, params, network }: RpcRequestWebViewRequestContext) => {
      return request<Result>({
        method: 'rpc_request',
        context: {
          method: method,
          params,
          network,
        },
      });
    },
    removeAllListeners: () => {
      for (const eventName of provider._eventNames) {
        for (const [listener] of provider._wrappedListeners) {
          provider.removeListener(eventName, listener);
        }
      }

      return provider;
    },
  };
  const evmProvider: EvmProvider = {
    ...provider,

    isMetaMask: true,
    isKrakenWallet: true,
    _isConnected: false,
    _metamask: {
      isUnlocked: () => Promise.resolve(true),
    },

    on: (eventName: string, listener: EventListener) => {
      let wrappedListener = listener;

      if (eventName === 'connect') {
        wrappedListener = (...args) => {
          evmProvider._isConnected = true;
          return listener(...args);
        };
      } else if (eventName === 'disconnect' || eventName === 'close') {
        wrappedListener = (...args) => {
          evmProvider._isConnected = false;
          return listener(...args);
        };
      }

      return provider.on(eventName, wrappedListener);
    },
    request: ({ method, params }: RpcRequest) => {
      return provider.rpcRequest<RpcResponse>({ method, params, network: 'evm' }).then(result => {
        if ('result' in result) {
          return result.result;
        }

        throw result.error;
      });
    },
    sendAsync: (rpcRequest: RpcRequest, callback: SendCallback) => {
      const id = 'id' in rpcRequest && typeof rpcRequest.id === 'number' ? rpcRequest.id : undefined;

      evmProvider
        .request(rpcRequest)
        .then(result =>
          callback(null, {
            id,
            jsonrpc: '2.0',
            result,
          }),
        )
        .catch(error => callback(error, null));
    },
    send: (requestOrMethod: RpcRequest | RpcRequest['method'], callbackOrParams: SendCallback | RpcRequest['params']) => {
      if (typeof requestOrMethod !== 'string') {
        return evmProvider.sendAsync(requestOrMethod, callbackOrParams as SendCallback);
      }

      return evmProvider.request({ method: requestOrMethod, params: callbackOrParams });
    },
    isConnected: () => evmProvider._isConnected,
    enable: () => evmProvider.request({ method: RpcMethod.eth_requestAccounts, params: [] }),
  };

  window.ethereum = evmProvider;

  const info = {
    uuid: window.crypto.randomUUID(),
    name: 'Kraken Wallet',
    icon: 'data:image/webp;base64,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',
    rdns: 'com.kraken.wallet',
  };
  const event = new CustomEvent('eip6963:announceProvider', {
    detail: Object.freeze({ info, provider: evmProvider }),
  });

  window.addEventListener('eip6963:requestProvider', () => {
    window.dispatchEvent(event);
  });

  setTimeout(() => {
    window.dispatchEvent(event);
    window.dispatchEvent(new Event('ethereum#initialized'));
  }, 0);
  log('\n\n\n\n\nHello from the injected script');
}

export const getInjectedScriptString = (secret: string, platform: typeof Platform.OS) => `(${injectProviders.toString()})('${secret}','${platform}');`;
