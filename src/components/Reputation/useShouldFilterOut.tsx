import { isNetworkCoin } from '@/onChain/wallets/registry';

export type FilterOut = { reputation: string[]; coinDesignation: 'network'[]  };

export const useShouldFilterOut = ({ assetId, reputation }: { assetId: string; reputation: string }, filterOut: FilterOut) => {
  if (filterOut.coinDesignation.includes('network') && isNetworkCoin(assetId)) {
    return true;
  }

  if (filterOut.reputation.includes(reputation)) {
    return true;
  }

  return false;
};
