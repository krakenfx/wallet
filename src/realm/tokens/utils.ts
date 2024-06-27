import { networkIdToNetworkName } from '@/onChain/wallets/registry';

import { untilFirstBackslash } from '@/utils/stringUtils';

export const getNetworkNameFromAssetId = (assetId: string) => {
  const networkId = (assetId.match(untilFirstBackslash) || []).join();

  return networkId.startsWith('solana:') ? 'solana' : networkIdToNetworkName[networkId] ?? '';
};
