export enum RpcMethods {
  eth_chainId = 'eth_chainId',
  eth_accounts = 'eth_accounts',
  eth_sendTransaction = 'eth_sendTransaction',
  eth_signTransaction = 'eth_signTransaction',
  personal_sign = 'personal_sign',
  eth_signTypedData = 'eth_signTypedData',
  eth_signTypedData_v3 = 'eth_signTypedData_v3',
  eth_signTypedData_v4 = 'eth_signTypedData_v4',
  eth_requestAccounts = 'eth_requestAccounts',
  eth_getBalance = 'eth_getBalance',
  eth_blockNumber = 'eth_blockNumber',
  eth_call = 'eth_call',
  eth_createAccessList = 'eth_createAccessList',
  eth_estimateGas = 'eth_estimateGas',
  eth_gasPrice = 'eth_gasPrice',
  eth_getBlockByHash = 'eth_getBlockByHash',
  eth_getBlockByNumber = 'eth_getBlockByNumber',
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
  eth_getUncleByBlockHashAndIndex = 'eth_getUncleByBlockHashAndIndex',
  eth_getUncleByBlockNumberAndIndex = 'eth_getUncleByBlockNumberAndIndex',
  eth_getUncleCountByBlockHash = 'eth_getUncleCountByBlockHash',
  eth_getUncleCountByBlockNumber = 'eth_getUncleCountByBlockNumber',
  eth_feeHistory = 'eth_feeHistory',
  eth_getBlockReceipts = 'eth_getBlockReceipts',
  eth_maxPriorityFeePerGas = 'eth_maxPriorityFeePerGas',
  bor_getAuthor = 'bor_getAuthor',
  bor_getCurrentProposer = 'bor_getCurrentProposer',
  bor_getCurrentValidators = 'bor_getCurrentValidators',
  bor_getRootHash = 'bor_getRootHash',
  eth_getTransactionReceiptsByBlock = 'eth_getTransactionReceiptsByBlock',
}

export enum WalletRequestMethods {
  wallet_revokePermissions = 'wallet_revokePermissions',
  wallet_getCapabilities = 'wallet_getCapabilities',
  wallet_switchEthereumChain = 'wallet_switchEthereumChain',
  wallet_requestPermissions = 'wallet_requestPermissions',
}

export interface PageInfo {
  icon: string;
  url: string;
}
