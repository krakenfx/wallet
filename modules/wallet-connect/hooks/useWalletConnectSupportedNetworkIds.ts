import { isTestNet } from '@/onChain/wallets/registry';
import { useIsTestnetEnabled } from '@/realm/settings';

import { WALLET_CONNECT_SUPPORTED_NETWORKS, WALLET_CONNECT_SUPPORTED_NETWORK_IDS } from '/modules/wallet-connect/consts';

export const useWalletConnectSupportedNetworkIds = () => {
  const isTestnetEnabled = useIsTestnetEnabled();
  const walletConnectSupportedNetworkIds = isTestnetEnabled
    ? WALLET_CONNECT_SUPPORTED_NETWORK_IDS
    : WALLET_CONNECT_SUPPORTED_NETWORKS.filter(network => !isTestNet(network)).map(nonTestnet => nonTestnet.caipId);

  return walletConnectSupportedNetworkIds;
};
