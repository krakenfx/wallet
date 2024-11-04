import { getNetworkNameFromAssetId } from '@/realm/tokens';
import type { RemoteAsset } from '@/types';

type TokenLikeProps = {
  assetId: string;
  address: string;
  decimals?: string | number;
  name?: string;
  symbol?: string;
  whitelists?: string[];
  blacklists?: string[];
};

export function adaptTokenLikeToRemoteAsset({ assetId, name, symbol, address, decimals, whitelists, blacklists }: TokenLikeProps): RemoteAsset {
  return {
    assetId,
    balance: '0',
    metadata: {
      label: name ?? '',
      symbol: symbol ?? '',
      tokenAddress: address,
      
      
      decimals: typeof decimals === 'number' ? decimals : typeof decimals === 'string' ? Number(decimals) : 2,
      reputation: {
        whitelists: whitelists ?? [],
        blacklists: blacklists ?? [],
      },
      walletType: getNetworkNameFromAssetId(assetId),
    },
    type: 'remoteAsset',
  };
}
