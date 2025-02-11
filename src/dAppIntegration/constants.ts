import { arbitrumNetwork, baseNetwork, blastNetwork, inkNetwork } from '@/onChain/wallets/evmNetworks';

export const defaultEvmChainIdByDomain: Record<string, number> = {
  'aerodrome.finance': baseNetwork.chainId,
  'app.thruster.finance': blastNetwork.chainId,
  'app.gmx.io': arbitrumNetwork.chainId,
  'blast.io': blastNetwork.chainId,
  'inkyswap.com': inkNetwork.chainId,
  'inkypump.com': inkNetwork.chainId,
};

export enum EvmRpcMethod {
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

export enum EvmWalletMethod {
  wallet_switchEthereumChain = 'wallet_switchEthereumChain',
  wallet_requestPermissions = 'wallet_requestPermissions',
  wallet_revokePermissions = 'wallet_revokePermissions',
  wallet_getPermissions = 'wallet_getPermissions',
}

export enum SolanaRpcMethod {
  sol_connect = 'sol_connect',
  sol_disconnect = 'sol_disconnect',
  sol_signMessage = 'sol_signMessage',
  sol_signTransactions = 'sol_signTransactions',
  sol_signAndSendTransactions = 'sol_signAndSendTransactions',
}
