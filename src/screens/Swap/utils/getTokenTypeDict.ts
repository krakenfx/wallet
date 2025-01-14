import type { SwapToTokenListResult, TokenType } from '@/api/types';
import { getNetworkFilterFromCaip } from '@/components/NetworkFilter/getNetworkFilterFromCaip';
import type { NETWORK_FILTER } from '@/components/NetworkFilter/types';
import { type WalletType, networkIdToNetworkName } from '@/onChain/wallets/registry';

export const getTokenTypeDict = (data: SwapToTokenListResult, networkFilter: NETWORK_FILTER[]): Record<string, TokenType> => {
  const flattened: Record<string, TokenType> = {};

  for (const networkCaip in data.toTokens) {
    const walletType: WalletType | undefined = networkIdToNetworkName[networkCaip];

    if (networkFilter.length > 0 && !networkFilter.includes(getNetworkFilterFromCaip(networkCaip))) {
      continue;
    }

    if (!walletType) {
      continue;
    }

    Object.assign(flattened, data.toTokens[networkCaip]);

    delete flattened[`${networkCaip}/erc20:0x0000000000000000000000000000000000000000`];
  }

  return flattened;
};
