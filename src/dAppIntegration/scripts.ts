// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { Platform } from 'react-native';

import type {
  EventEmitter,
  EvmProvider,
  ListenerItem,
  Provider,
  SendCallback,
  SolanaProvider,
  UnsignedWebViewRequest,
  WalletStandardAccount,
  WalletStandardRegisterApi,
  WalletStandardRegisterApiCallback,
  WalletStandardWallet,
  WebViewEvent,
  WebViewRequest,
  WebViewRequestContext,
  WebViewRequestResult,
  WebViewResponse,
} from './types';

import type { PublicKey, SendOptions, Transaction, VersionedTransaction } from '@solana/web3.js';

function injectProviders(secret: string, platform: typeof Platform.OS, solanaSdk: any) {
  'show source';

  if (window.ethereum !== undefined) {
    return;
  }

  const encoder = new TextEncoder();
  const requestMap = new Map<string, { resolve: (value: WebViewResponse['result']) => void; reject: (error: Error) => void }>();

  function createEventEmitter(): EventEmitter {
    const listenersMap = new Map<string, ListenerItem[]>();

    function addListener(eventName: string, item: ListenerItem): void {
      if (!listenersMap.has(eventName)) {
        listenersMap.set(eventName, [item]);
        return;
      }

      listenersMap.get(eventName)!.push(item);
    }

    return {
      on(eventName, listener) {
        addListener(eventName, { func: listener });
        return this;
      },
      addListener(eventName, listener) {
        return this.on(eventName, listener);
      },
      once(eventName, listener) {
        addListener(eventName, { func: listener, once: true });
        return this;
      },
      emit(eventName, ...args) {
        if (!listenersMap.has(eventName)) {
          return false;
        }

        const listeners = listenersMap.get(eventName)!;

        listeners.forEach(listener => {
          listener.func(...args);

          if (listener.once) {
            this.removeListener(eventName, listener.func);
          }
        });
        return listeners.length > 0;
      },
      eventNames() {
        return Array.from(listenersMap.keys());
      },
      listenerCount(eventName, listener?) {
        if (!listenersMap.has(eventName)) {
          return 0;
        }

        const listeners = listenersMap.get(eventName)!;

        if (listener === undefined) {
          return listeners.length;
        }

        return listeners.reduce((count, { func }) => (func === listener ? count + 1 : count), 0);
      },
      listeners(eventName) {
        if (!listenersMap.has(eventName)) {
          return [];
        }

        return listenersMap.get(eventName)!.map(({ func }) => func);
      },
      removeListener(eventName, listener) {
        if (!listenersMap.has(eventName)) {
          return this;
        }

        const listeners = listenersMap.get(eventName)!;
        const index = listeners.findIndex(({ func }) => func === listener);

        if (index !== -1) {
          listeners.splice(index, 1);
        }

        return this;
      },
      off(eventName, listener) {
        return this.removeListener(eventName, listener);
      },
      removeAllListeners(eventName) {
        listenersMap.delete(eventName);
        return this;
      },
    };
  }

  function toHex(data: Uint8Array) {
    return Array.from(data)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function fromHex(data: string) {
    const result = new Uint8Array(data.length / 2);

    for (let i = 0, l = data.length; i < l; i += 2) {
      result[i / 2] = parseInt(data.substring(i, i + 2), 16);
    }

    return result;
  }

  function signRequest(request: UnsignedWebViewRequest): Promise<string> {
    const requestString = JSON.stringify(request);
    const requestBuffer = encoder.encode(requestString);
    const secretBuffer = fromHex(secret);
    const algorithm = { name: 'HMAC', hash: { name: 'SHA-256' } };

    return window.crypto.subtle
      .importKey('raw', secretBuffer, algorithm, false, ['sign'])
      .then(key => window.crypto.subtle.sign(algorithm, key, requestBuffer))
      .then(signature => toHex(new Uint8Array(signature)));
  }

  function request<Method extends WebViewRequest['method']>(method: Method, context: WebViewRequestContext[Method]): Promise<WebViewRequestResult[Method]> {
    const requestId = window.crypto.randomUUID();
    const unsignedRequest = {
      id: requestId,
      method,
      context,
    };

    return signRequest(unsignedRequest).then(
      signature =>
        new Promise<WebViewRequestResult[Method]>((resolve, reject) => {
          const signedRequest = {
            ...unsignedRequest,
            signature,
          };
          const signedRequestString = JSON.stringify(signedRequest);

          if (method === 'rpc_request') {
            // @ts-expect-error TS can not narrow resolve type based on method
            requestMap.set(requestId, { resolve, reject });
          } else {
            // @ts-expect-error ☝️☝️☝️
            resolve();
          }

          window.ReactNativeWebView.postMessage(signedRequestString);
        }),
    );
  }

  function rpcRequest(context: WebViewRequestContext['rpc_request']) {
    return request('rpc_request', context).then(rpcResponse => {
      if (rpcResponse.result !== undefined) {
        return rpcResponse.result as any;
      }

      return Promise.reject(rpcResponse.error ?? { code: 4900, message: 'Unexpected error' });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  function log(message: any): void {
    request('log', { message });
  }

  function postPageInfo(): void {
    const metaElement = document.querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-title"]');
    const linkElement = document.querySelector<HTMLLinkElement>('link[rel="icon"]') ?? document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]');

    request('post_page_info', {
      iconUrl: linkElement?.href,
      title: metaElement?.getAttribute('content') ?? undefined,
    });
  }

  const evmProvider: EvmProvider = (() => {
    const evmProvider: EvmProvider = {
      ...createEventEmitter(),

      _metamask: {
        isUnlocked() {
          return true;
        },
      },
      isMetaMask: true as const,
      isKrakenWallet: true as const,
      chainId: '0x1',
      networkVersion: '1',
      selectedAddress: null,

      request(payload) {
        return rpcRequest({
          ...payload,
          network: 'evm',
        });
      },
      enable() {
        return this.request({ method: 'eth_requestAccounts' });
      },
      isConnected() {
        return this.selectedAddress !== null;
      },
      send(rpcRequestOrMethod, callbackOrParams) {
        if (typeof rpcRequestOrMethod !== 'string') {
          return this.sendAsync(rpcRequestOrMethod, callbackOrParams as SendCallback);
        }

        return this.request({ method: rpcRequestOrMethod, params: callbackOrParams });
      },
      sendAsync(rpcRequest, callback) {
        const id = 'id' in rpcRequest && typeof rpcRequest.id === 'number' ? rpcRequest.id : undefined;

        this.request(rpcRequest)
          .then(result =>
            callback(null, {
              id,
              result,
            }),
          )
          .catch(error => callback(error, null));
      },
    };

    function handleChainChange(chainId: string): void {
      if (evmProvider.chainId !== chainId) {
        evmProvider.chainId = chainId;
        evmProvider.networkVersion = parseInt(chainId, 16).toString();
      }
    }

    function handleAddressChange(address: string | null) {
      if (evmProvider.selectedAddress !== address) {
        evmProvider.selectedAddress = address;
      }
    }

    evmProvider.on('connect', ({ chainId }: { chainId: string }) => handleChainChange(chainId));
    evmProvider.on('chainChanged', handleChainChange);
    evmProvider.on('networkChanged', handleChainChange);
    evmProvider.on('accountsChanged', ([address]: string[]) => handleAddressChange(address));
    evmProvider.on('disconnect', () => handleAddressChange(null));

    return evmProvider;
  })();

  function serializeTransaction(transaction: Transaction | VersionedTransaction) {
    return 'version' in transaction
      ? transaction.serialize()
      : new Uint8Array(
          transaction.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          }),
        );
  }

  const solanaProvider: SolanaProvider = (() => {
    function toPublicKey(stringOrBuffer: string | Uint8Array): PublicKey {
      return new solanaSdk.PublicKey(stringOrBuffer);
    }

    function toTransaction(data: string, versioned?: boolean): Transaction | VersionedTransaction {
      if (versioned) {
        return solanaSdk.VersionedTransaction.deserialize(fromHex(data));
      }

      return solanaSdk.Transaction.from(fromHex(data));
    }

    function SolanaError(this: any, error: any) {
      Error.call(this, error.message);
      Object.setPrototypeOf(this, SolanaError.prototype);

      this.code = error.code;
    }

    SolanaError.prototype = Object.create(Error.prototype);
    SolanaError.prototype.constructor = SolanaError;

    SolanaError.prototype.toString = function () {
      return this.message;
    };

    function solanaRpcRequest(context: WebViewRequestContext['rpc_request']) {
      return rpcRequest(context).catch(error => {
        // @ts-expect-error legacy class syntax
        throw new SolanaError(error);
      });
    }

    function signTransactions(transactions: (Transaction | VersionedTransaction)[]): Promise<(Transaction | VersionedTransaction)[]> {
      const versioned = transactions.map(t => 'version' in t);
      const serializedTransactions = transactions.map(t => toHex(serializeTransaction(t)));

      return solanaRpcRequest({
        method: 'sol_signTransactions',
        params: serializedTransactions.map((t, i) => [t, versioned[i]]),
        network: 'solana',
      }).then(rpcResult => rpcResult.map((item: string, i: number) => toTransaction(item, versioned[i])));
    }

    function signAndSendTransactions(
      transactions: (Transaction | VersionedTransaction)[],
      _options?: SendOptions,
    ): Promise<{ publicKey: string; signature: string }[]> {
      const serializedTransactions = transactions.map(t => toHex(serializeTransaction(t)));

      return solanaRpcRequest({
        method: 'sol_signAndSendTransactions',
        params: serializedTransactions.map((t, i) => [t, 'version' in transactions[i]]),
        network: 'solana',
      });
    }

    const eventEmitter = createEventEmitter();

    return {
      ...eventEmitter,

      isPhantom: true as const,
      isKrakenWallet: true as const,
      publicKey: null,

      get isConnected() {
        return this.publicKey !== null;
      },
      on(eventName, listener) {
        if (eventName === 'connect') {
          return eventEmitter.on('connect', (publicKeyString: string) => {
            return listener(toPublicKey(publicKeyString));
          });
        }

        return eventEmitter.on(eventName, listener);
      },
      connect() {
        return solanaRpcRequest({ method: 'sol_connect', network: 'solana' }).then(rpcResult => {
          this.publicKey = toPublicKey(rpcResult);

          return {
            publicKey: this.publicKey!,
          };
        });
      },
      disconnect() {
        if (!this.isConnected) {
          return Promise.resolve();
        }

        return solanaRpcRequest({ method: 'sol_disconnect', network: 'solana' }).then(() => {
          this.publicKey = null;
        });
      },
      signMessage(message, encoding = 'utf8') {
        return solanaRpcRequest({ method: 'sol_signMessage', params: [toHex(message), encoding], network: 'solana' }).then(rpcResult => {
          return {
            signature: fromHex(rpcResult.signature),
            publicKey: toPublicKey(rpcResult.publicKey),
          };
        });
      },
      signTransaction(transaction) {
        return signTransactions([transaction]).then(signedTransactions => signedTransactions[0]);
      },
      signAllTransactions(transactions) {
        return signTransactions(transactions);
      },
      signAndSendTransaction(transaction: Transaction | VersionedTransaction, options?: SendOptions) {
        return signAndSendTransactions([transaction], options).then(results => results[0]);
      },
      signAndSendAllTransactions(transactions: (Transaction | VersionedTransaction)[], options?: SendOptions) {
        return signAndSendTransactions(transactions, options).then(results => ({
          publicKey: results[0].publicKey,
          signatures: results.map(result => result.signature),
        }));
      },
    };
  })();

  const SOLANA_CHAINS = ['solana:mainnet', 'solana:devnet'];

  function createWalletStandardAccount(publicKey: PublicKey): WalletStandardAccount {
    const address = publicKey.toBase58();
    const publicKeyAsBytes = publicKey.toBytes();
    const features = ['solana:signAndSendTransaction', 'solana:signTransaction', 'solana:signMessage'];

    return {
      get address() {
        return address;
      },
      get publicKey() {
        return publicKeyAsBytes.slice();
      },
      get chains() {
        return SOLANA_CHAINS.slice();
      },
      get features() {
        return features.slice();
      },
    };
  }

  function createWalletStandardWallet(icon: string, name: string, provider: SolanaProvider) {
    let account: WalletStandardAccount | null = null;
    const eventEmitter = createEventEmitter();

    function handleConnection(publicKey: PublicKey) {
      const address = publicKey.toBase58();

      if (account === null || account.address !== address) {
        account = createWalletStandardAccount(publicKey);

        eventEmitter.emit('change', { accounts: [account] });
      }
    }

    const wallet: WalletStandardWallet = {
      get version() {
        return '1.0.0' as const;
      },
      get name() {
        return name;
      },
      get icon() {
        return icon;
      },
      get chains() {
        return SOLANA_CHAINS.slice();
      },
      get accounts() {
        if (account === null) {
          return [];
        }

        return [account];
      },
      get features() {
        return {
          'standard:events': {
            version: '1.0.0' as const,
            on: this.on,
          },
          'standard:connect': {
            version: '1.0.0' as const,
            connect: this.connect,
          },
          'standard:disconnect': {
            version: '1.0.0' as const,
            disconnect: this.disconnect,
          },
          'solana:signAndSendTransaction': {
            version: '1.0.0' as const,
            supportedTransactionVersions: ['legacy', 0],
            signAndSendTransaction: this.signAndSendTransaction,
          },
          'solana:signTransaction': {
            version: '1.0.0' as const,
            supportedTransactionVersions: ['legacy', 0],
            signTransaction: this.signTransaction,
          },
          'solana:signMessage': {
            version: '1.0.0' as const,
            signMessage: this.signMessage,
          },
        };
      },

      on(eventName, listener) {
        eventEmitter.on(eventName, listener);
        return () => eventEmitter.off(eventName, listener);
      },
      connect() {
        if (account !== null) {
          return Promise.resolve({ accounts: this.accounts });
        }

        return provider.connect().then(result => {
          handleConnection(result.publicKey);
          return { accounts: this.accounts };
        });
      },
      disconnect() {
        log('disconnect is called');
        return provider.disconnect();
      },
      signMessage(...inputs) {
        if (account === null) {
          throw new Error('Not connected');
        }

        return Promise.all(
          inputs.map(input => {
            if (input.account !== account) {
              throw new Error('Invalid account');
            }

            return provider.signMessage(input.message).then(result => {
              return {
                signedMessage: input.message,
                signature: result.signature,
              };
            });
          }),
        );
      },
      signTransaction(...inputs) {
        if (account === null) {
          throw new Error('Not connected');
        }

        const chains = new Set(inputs.filter(input => input.chain !== undefined).map(input => input.chain));

        if (chains.size > 1) {
          throw new Error('Conflicting chains');
        }

        return Promise.all(
          inputs.map(input => {
            if (input.account !== account) {
              throw new Error('Invalid account');
            }

            if (input.chain !== undefined && !input.chain.startsWith('solana:')) {
              throw new Error('Invalid chain');
            }

            return provider.signTransaction(solanaSdk.VersionedTransaction.deserialize(input.transaction)).then(result => {
              return {
                signedTransaction: serializeTransaction(result),
              };
            });
          }),
        );
      },
      signAndSendTransaction(...inputs) {
        if (account === null) {
          throw new Error('Not connected');
        }

        const chains = new Set(inputs.map(input => input.chain));

        if (chains.size > 1) {
          throw new Error('Conflicting chains');
        }

        return Promise.all(
          inputs.map(input => {
            if (input.account !== account) {
              throw new Error('Invalid account');
            }

            if (!input.chain.startsWith('solana:')) {
              throw new Error('Invalid chain');
            }

            return provider.signAndSendTransaction(solanaSdk.VersionedTransaction.deserialize(input.transaction), input.options).then(result => {
              return {
                signature: result.signature,
              };
            });
          }),
        );
      },
      signAndSendAllTransaction(inputs) {
        return this.signAndSendTransaction(...inputs);
      },
    };

    provider.on('connect', handleConnection);
    provider.on('disconnect', () => {
      account = null;

      eventEmitter.emit('change', { accounts: [] });
    });

    return wallet;
  }

  function handleMessageEvent(messageEvent: MessageEvent<string> | Event) {
    if (!(messageEvent instanceof MessageEvent)) {
      return;
    }

    try {
      const responseOrEvent = JSON.parse(messageEvent.data) as WebViewResponse | WebViewEvent;

      if ('network' in responseOrEvent) {
        const provider: Provider = responseOrEvent.network === 'evm' ? evmProvider : solanaProvider;

        provider.emit(responseOrEvent.name, ...responseOrEvent.args);
        return;
      }

      if (requestMap.has(responseOrEvent.id)) {
        const { resolve, reject } = requestMap.get(responseOrEvent.id)!;

        if (responseOrEvent.error !== undefined) {
          reject(new Error(responseOrEvent.error));
        } else {
          resolve(responseOrEvent.result);
        }

        requestMap.delete(responseOrEvent.id);
      }
    } catch {
      return; // ignore malformed messages
    }
  }

  if (platform === 'ios') {
    window.addEventListener('message', handleMessageEvent);
  } else {
    document.addEventListener('message', handleMessageEvent);
  }

  postPageInfo();

  window.ethereum = evmProvider;
  window.solana = solanaProvider;

  const name = 'Kraken Wallet';
  const icon =
    'data:image/webp;base64,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';
  const walletStandardWallet = createWalletStandardWallet(icon, name, solanaProvider);
  const walletStandardEvent = new CustomEvent<WalletStandardRegisterApiCallback>('wallet-standard:register-wallet', {
    detail: ({ register }) => {
      register(walletStandardWallet);
    },
  });
  const eip6963Event = new CustomEvent('eip6963:announceProvider', {
    detail: Object.freeze({
      info: {
        uuid: window.crypto.randomUUID(),
        name,
        icon,
        rdns: 'com.kraken.wallet',
      },
      provider: evmProvider,
    }),
  });

  window.addEventListener('eip6963:requestProvider', () => {
    window.dispatchEvent(eip6963Event);
  });
  window.addEventListener('wallet-standard:app-ready', event => {
    if ('detail' in event) {
      const typedEvent = event as CustomEvent<WalletStandardRegisterApi>;

      typedEvent.detail.register(walletStandardWallet);
    }
  });

  window.dispatchEvent(eip6963Event);
  window.dispatchEvent(walletStandardEvent);
  log('\n\n\nHello from the injected script!');
}

export const getInjectedScriptString = (secret: string, platform: typeof Platform.OS, solanaSdk: string) =>
  `(function(){${solanaSdk}(${injectProviders.toString()})('${secret}','${platform}', solanaWeb3);})();`;
