import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';

type Params =
  | {
      assetId: string;
    }
  | {
      walletType: string;
    };

export const isBtc = (params: Params) => {
  if ('assetId' in params) {
    return params.assetId === ChainAgnostic.COIN_BITCOIN;
  }

  if ('walletType' in params) {
    return params.walletType === 'HDsegwitBech32';
  }

  return false;
};
