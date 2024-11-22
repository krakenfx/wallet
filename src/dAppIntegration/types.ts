export enum RpcMethod {
  bor_getAuthor = 'bor_getAuthor',
  bor_getCurrentProposer = 'bor_getCurrentProposer',
  bor_getCurrentValidators = 'bor_getCurrentValidators',
  bor_getRootHash = 'bor_getRootHash',
  eth_accounts = 'eth_accounts',
  eth_blockNumber = 'eth_blockNumber',
  eth_call = 'eth_call',
  eth_chainId = 'eth_chainId',
  eth_createAccessList = 'eth_createAccessList',
  eth_estimateGas = 'eth_estimateGas',
  eth_feeHistory = 'eth_feeHistory',
  eth_gasPrice = 'eth_gasPrice',
  eth_getBalance = 'eth_getBalance',
  eth_getBlockByHash = 'eth_getBlockByHash',
  eth_getBlockByNumber = 'eth_getBlockByNumber',
  eth_getBlockReceipts = 'eth_getBlockReceipts',
  eth_getBlockTransactionCountByHash = 'eth_getBlockTransactionCountByHash',
  eth_getBlockTransactionCountByNumber = 'eth_getBlockTransactionCountByNumber',
  eth_getCode = 'eth_getCode',
  eth_getProof = 'eth_getProof',
  eth_getStorageAt = 'eth_getStorageAt',
  eth_getTransactionByBlockHashAndIndex = 'eth_getTransactionByBlockHashAndIndex',
  eth_getTransactionByBlockNumberAndIndex = 'eth_getTransactionByBlockNumberAndIndex',
  eth_getTransactionByHash = 'eth_getTransactionByHash',
  eth_getTransactionCount = 'eth_getTransactionCount',
  eth_getTransactionReceipt = 'eth_getTransactionReceipt',
  eth_getTransactionReceiptsByBlock = 'eth_getTransactionReceiptsByBlock',
  eth_getUncleByBlockHashAndIndex = 'eth_getUncleByBlockHashAndIndex',
  eth_getUncleByBlockNumberAndIndex = 'eth_getUncleByBlockNumberAndIndex',
  eth_getUncleCountByBlockHash = 'eth_getUncleCountByBlockHash',
  eth_getUncleCountByBlockNumber = 'eth_getUncleCountByBlockNumber',
  eth_maxPriorityFeePerGas = 'eth_maxPriorityFeePerGas',
  eth_requestAccounts = 'eth_requestAccounts',
  eth_sendTransaction = 'eth_sendTransaction',
  eth_signTransaction = 'eth_signTransaction',
  eth_signTypedData = 'eth_signTypedData',

  eth_signTypedData_v1 = 'eth_signTypedData_v1',
  eth_signTypedData_v3 = 'eth_signTypedData_v3',
  eth_signTypedData_v4 = 'eth_signTypedData_v4',
  personal_sign = 'personal_sign',
  web3_sha3 = 'web3_sha3',
}

export enum WalletMethod {
  wallet_switchEthereumChain = 'wallet_switchEthereumChain',
  wallet_requestPermissions = 'wallet_requestPermissions',
  wallet_revokePermissions = 'wallet_revokePermissions',
  wallet_getPermissions = 'wallet_getPermissions',
}

export interface PageInfo {
  iconUrl?: string;
  title?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WebViewRequestBase<Context extends Record<string, any> | undefined = undefined> = {
  id: string;
  signature: string;
} & (Context extends undefined ? Record<string, never> : { context: Context });

export interface WebViewResponse<Result = undefined> {
  id: string;
  result?: Result;
  error?: string;
}

export interface WebViewEvent {
  event: string;
  data: unknown[];
}

export interface GetPageInfoWebViewRequest extends WebViewRequestBase<PageInfo> {
  method: 'get_page_info';
}

export type RpcRequestWebViewRequestNetwork = 'evm' | 'solana';

export type RpcRequest = {
  id?: number;
  method: RpcMethod | WalletMethod;
  params?: unknown[] | object;
};

export type RpcRequestWebViewRequestContext = RpcRequest & {
  network: RpcRequestWebViewRequestNetwork;
};

export interface RpcRequestWebViewRequest extends WebViewRequestBase<RpcRequestWebViewRequestContext> {
  method: 'rpc_request';
}

export type RpcResponse = {
  id?: number;
  jsonrpc?: '2.0';
} & ({ result: unknown } | { error: { code: number; message: string } });

export interface LogWebViewRequestContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any;
}

export interface LogWebViewRequest extends WebViewRequestBase<LogWebViewRequestContext> {
  method: 'log';
}

export type WebViewRequest = GetPageInfoWebViewRequest | RpcRequestWebViewRequest | LogWebViewRequest;

export type ProviderRpcError = {
  code: number;
  message: string;
  data?: unknown;
};

export type CaveatsObject = {
  [caveat: string]: unknown;
};

export type RequestRevokePermissionsParams = [
  {
    [method: string]: CaveatsObject;
  },
];

export interface CaveatItem {
  type: string;
  value: unknown;
}

export interface Permission {
  invoker: string;
  parentCapability: RpcMethod;
  caveats: CaveatItem[];
  date: number;
}

export type RequestPermissionsResult = {
  parentCapability: RpcMethod;
  date?: number;
}[];

export type SwitchEthereumChainParams = [
  {
    chainId: string;
  },
];
