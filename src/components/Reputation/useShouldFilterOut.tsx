import { isNetworkCoin } from '@/onChain/wallets/registry';

export type FilterOut = { reputation: string[]; coinDesignation: 'network'[] };

export const useShouldFilterOut = ({ tokenID, reputation }: { tokenID: string; reputation: string }, filterOut: FilterOut) => {
  if (filterOut.coinDesignation.includes('network') && isNetworkCoin(tokenID)) {
    return true;
  }

  if (filterOut.reputation.includes(reputation)) {
    return true;
  }

  return false;
};
