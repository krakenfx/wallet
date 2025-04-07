import BigNumber from 'bignumber.js';

import type { KrakenAssetSupported } from '@/api/krakenConnect/types';
import { getAvailableTokenBalance } from '@/realm/tokens';
import { unitConverter } from '@/utils/unitConverter';

interface Params {
  asset: KrakenAssetSupported;
  feeAmount: string | undefined;
}

export const useAvailableBalance = ({ asset, feeAmount }: Params) => {
  const balance = new BigNumber(asset.balance).minus(asset.hold_trade).toString(10);
  const fee = unitConverter.smallUnit2TokenUnit(feeAmount ?? 0, asset.metadata.decimals);
  const balanceAmount = unitConverter.smallUnit2TokenUnit(new BigNumber(getAvailableTokenBalance({ ...asset, balance })), asset.metadata.decimals);
  return balanceAmount.minus(fee).toString(10);
};
