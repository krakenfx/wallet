import type { PublicKey, SendOptions, Transaction, VersionedTransaction } from '@solana/web3.js';

export type EventEmitterListener = (...args: any[]) => void;

export interface EventEmitter {
  on(eventName: string, listener: EventEmitterListener): EventEmitter;
  addListener(eventName: string, listener: EventEmitterListener): EventEmitter;
  once(eventName: string, listener: EventEmitterListener): EventEmitter;
  emit(eventName: string, ...args: any[]): boolean;
  eventNames(): string[];
  listenerCount(eventName: string, listener?: EventEmitterListener): number;
  listeners(eventName: string): EventEmitterListener[];
  removeListener(eventName: string, listener: EventEmitterListener): EventEmitter;
  off(eventName: string, listener: EventEmitterListener): EventEmitter;
  removeAllListeners(eventName: string): EventEmitter;
}

export type ListenerItem = {
  func: EventEmitterListener;
  once?: boolean;
};

export interface UnsignedWebViewRequest {
  id: string;
}

interface LogWebViewRequest extends UnsignedWebViewRequest {
  method: 'log';
  context: { message: any };
}

export interface PageInfo {
  iconUrl?: string;
  title?: string;
}

export interface PostPageInfoWebViewRequest extends UnsignedWebViewRequest {
  method: 'post_page_info';
  context: PageInfo;
}

export interface RpcRequest {
  id?: number;
  method: string;
  params?: unknown[] | object;
}

type Network = 'evm' | 'solana';

interface RpcRequestWebViewRequestContext extends RpcRequest {
  network: Network;
}

export interface RpcRequestWebViewRequest extends UnsignedWebViewRequest {
  method: 'rpc_request';
  context: RpcRequestWebViewRequestContext;
}

export type WebViewRequestContext = {
  log: LogWebViewRequest['context'];
  post_page_info: PostPageInfoWebViewRequest['context'];
  rpc_request: RpcRequestWebViewRequest['context'];
};

export type WebViewRequestResult = {
  log: undefined;
  post_page_info: undefined;
  rpc_request: RpcResponse;
};

export type WebViewRequest = LogWebViewRequest | PostPageInfoWebViewRequest | RpcRequestWebViewRequest;

export type SignedWebViewRequest = WebViewRequest & {
  signature: string;
};

interface WebViewResponseBase {
  id: string;
  error?: string;
}

export interface RpcResponse {
  id?: number;
  result?: unknown;
  error?: { code: number; message?: string };
}

interface RpcRequestWebViewResponse extends WebViewResponseBase {
  result?: RpcResponse;
}

export type WebViewResponse = RpcRequestWebViewResponse;

export interface WebViewEvent {
  network: Network;
  name: string;
  args: any[];
}

interface ProviderRpcError {
  code: number;
  message: string;
  data?: unknown;
}

export type SendCallback = (error: ProviderRpcError | null, result: RpcResponse | null) => void;

export interface Provider extends EventEmitter {}

export interface EvmProvider extends Provider {
  _metamask: {
    isUnlocked(): true;
  };
  isMetaMask: true;
  isKrakenWallet: true;
  chainId: string;
  networkVersion: string;
  selectedAddress: string | null;
  request(rpcRequest: RpcRequest): Promise<unknown>;
  enable(): Promise<unknown>;
  isConnected(): boolean;
  send(rpcRequestOrMethod: RpcRequest | RpcRequest['method'], callbackOrParams: SendCallback | RpcRequest['params']): void;
  sendAsync(rpcRequest: RpcRequest, callback: SendCallback): void;
}

export interface SolanaProvider extends Provider {
  isPhantom: true;
  isKrakenWallet: true;
  isConnected: boolean;
  publicKey: PublicKey | null;
  connect(): Promise<{
    publicKey: PublicKey;
  }>;
  disconnect(): Promise<void>;
  signAllTransactions(transactions: (Transaction | VersionedTransaction)[]): Promise<(Transaction | VersionedTransaction)[]>;
  signAndSendAllTransactions(
    transactions: (Transaction | VersionedTransaction)[],
    options?: SendOptions,
  ): Promise<{
    publicKey: string;
    signatures: string[];
  }>;
  signAndSendTransaction(
    transaction: Transaction | VersionedTransaction,
    options?: SendOptions,
  ): Promise<{
    publicKey: string;
    signature: string;
  }>;
  signMessage(message: Uint8Array): Promise<{
    publicKey: PublicKey;
    signature: Uint8Array;
  }>;
  signTransaction(transaction: Transaction | VersionedTransaction): Promise<Transaction | VersionedTransaction>;
}

export type CaveatsObject = {
  [caveat: string]: unknown;
};

export type RequestRevokePermissionsParams = [
  {
    [method: string]: CaveatsObject;
  },
];

export type RequestPermissionsResult = {
  parentCapability: string;
  date?: number;
}[];

export interface WalletStandardAccount {
  address: string;
  publicKey: Uint8Array;
  chains: string[];
  features: string[];
}

type SignAndSendTransactionInput = { transaction: Uint8Array; account: WalletStandardAccount; chain: string; options?: SendOptions };

export interface WalletStandardWallet {
  version: '1.0.0';
  name: string;
  icon: string;
  chains: string[];
  features: Record<string, unknown>;
  accounts: WalletStandardAccount[];
  on(eventName: string, listener: EventEmitterListener): () => void;
  connect(silent?: boolean): Promise<{ accounts: WalletStandardAccount[] }>;
  disconnect(): Promise<void>;
  signMessage(...inputs: { account: WalletStandardAccount; message: Uint8Array }[]): Promise<
    {
      signedMessage: Uint8Array;
      signature: Uint8Array;
    }[]
  >;
  signTransaction(...inputs: { transaction: Uint8Array; account: WalletStandardAccount; chain?: string }[]): Promise<{ signedTransaction: Uint8Array }[]>;
  signAndSendTransaction(...inputs: SignAndSendTransactionInput[]): Promise<{ signature: string }[]>;
  signAndSendAllTransaction(inputs: SignAndSendTransactionInput[]): Promise<{ signature: string }[]>;
}

export type WalletStandardRegisterApi = {
  register(wallet: WalletStandardWallet): () => void;
};

export type WalletStandardRegisterApiCallback = (api: WalletStandardRegisterApi) => void;

declare global {
  interface Window {
    ethereum: EvmProvider;
    solana: SolanaProvider;
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
  }
}
