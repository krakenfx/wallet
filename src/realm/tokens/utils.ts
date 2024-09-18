import { networkIdToNetworkName } from '@/onChain/wallets/registry';

import { Token } from '@/realm/tokens/schema';
import { untilFirstBackslash } from '@/utils/stringUtils';

export const getNetworkNameFromAssetId = (assetId: string) => {
  const networkId = (assetId.match(untilFirstBackslash) || []).join();

  
  
  return networkId.startsWith('solana:') ? 'solana' : networkIdToNetworkName[networkId] ?? '';
};

export const isTokenInGallery = (inGallery: Token['inGallery']) => {
  if (!inGallery) {
    return false;
  }
  return ['autoAdded', 'manuallyAdded'].includes(inGallery);
};
