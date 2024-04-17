import { networkIdToNetworkName } from '@/onChain/wallets/registry';

import { untilFirstBackslash } from '/modules/text-utils';

export const getNetworkNameFromAssetId = (assetId: string) => {
  const networkId = (assetId.match(untilFirstBackslash) || []).join();

  return networkId.startsWith('solana:') ? 'solana' : networkIdToNetworkName[networkId] ?? '';
};
