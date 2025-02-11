import { isTestNet } from '@/onChain/wallets/registry';
import { useIsTestnetEnabled } from '@/realm/settings';

import {
  WALLET_CONNECT_SESSION_NAMESPACE_KEY_EVM,
  WALLET_CONNECT_SESSION_NAMESPACE_KEY_SOLANA,
  WALLET_CONNECT_SUPPORTED_NETWORKS,
  WALLET_CONNECT_SUPPORTED_NETWORK_IDS,
} from '/modules/wallet-connect/consts';

export const getWalletConnectSupportedNetworkIds = (isTestnetEnabled: boolean, limitTo?: 'evm' | 'solana') => {
  let walletConnectSupportedNetworkIds = isTestnetEnabled
    ? WALLET_CONNECT_SUPPORTED_NETWORK_IDS
    : WALLET_CONNECT_SUPPORTED_NETWORKS.filter(network => !isTestNet(network)).map(nonTestnet => nonTestnet.caipId);

  if (limitTo === 'evm') {
    walletConnectSupportedNetworkIds = walletConnectSupportedNetworkIds.filter(network => network.startsWith(WALLET_CONNECT_SESSION_NAMESPACE_KEY_EVM));
  } else if (limitTo === 'solana') {
    walletConnectSupportedNetworkIds = walletConnectSupportedNetworkIds.filter(network => network.startsWith(WALLET_CONNECT_SESSION_NAMESPACE_KEY_SOLANA));
  }

  return walletConnectSupportedNetworkIds;
};

export const useWalletConnectSupportedNetworkIds = (limitTo?: 'evm' | 'solana') => {
  const isTestnetEnabled = useIsTestnetEnabled();
  return getWalletConnectSupportedNetworkIds(isTestnetEnabled, limitTo);
};
