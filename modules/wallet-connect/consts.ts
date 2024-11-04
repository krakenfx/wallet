import type { Network } from '@/onChain/wallets/base';
import { Networks } from '@/onChain/wallets/registry';

export const WALLET_CONNECT_SESSION_NAMESPACE_KEY_EVM = 'eip155';
export const WALLET_CONNECT_SESSION_NAMESPACE_KEY_SOLANA = 'solana';



export const WALLET_CONNECT_SUPPORTED_NETWORKS: Network[] = Object.values(Networks).filter(network => {
  return network.caipId.startsWith(WALLET_CONNECT_SESSION_NAMESPACE_KEY_EVM) || network.caipId.startsWith(WALLET_CONNECT_SESSION_NAMESPACE_KEY_SOLANA);
});

export const WALLET_CONNECT_SUPPORTED_NETWORK_IDS = WALLET_CONNECT_SUPPORTED_NETWORKS.map(network => {
  return network.caipId;
});

export const WALLET_CONNECT_SUPPORTED_SESSION_NAMESPACE_KEYS = [WALLET_CONNECT_SESSION_NAMESPACE_KEY_EVM, WALLET_CONNECT_SESSION_NAMESPACE_KEY_SOLANA];
