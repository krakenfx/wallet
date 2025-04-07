import BigNumber from 'bignumber.js';

import { BalanceHeader } from '@/components/BalanceHeader';
import type { DefiAsset, Position } from '@/components/DefiProtocolPositions/DefiProtocolPositions.types';
import { useAppCurrency } from '@/realm/settings';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';
import { smallUnit2TokenUnit } from '@/utils/unitConverter';

import { DefiDetailsHeaderBalanceSimple } from './DefiDetailsHeaderBalanceSimple';

export interface Props {
  position: Position;
}

export const DefiDetailsHeaderBalance: React.FC<Props> = ({ position }) => {
  const { currency, currencyInfo } = useAppCurrency();
  const fiatRate = useCurrentUsdFiatRate();
  const fiatTotal = position.positionUsdValue * fiatRate;
  const asset: DefiAsset | undefined = position.assets[0];

  const isSameNetwork = new Set(position.assets.map(a => a.network)).size === 1;
  const isSameToken = new Set(position.assets.map(a => a.id)).size === 1;

  const isSameNetworkSameToken = isSameNetwork && isSameToken;
  const nativeBalanceTotal = smallUnit2TokenUnit(
    BigNumber.sum(...position.assets.map(a => BigNumber(a.balanceNative).multipliedBy(position.isDebt ? -1 : 1))),
    asset?.decimals ?? 0,
  ).toString(10);

  return (
    <>
      {isSameNetworkSameToken ? (
        <BalanceHeader
          currency={currency}
          currencyInfo={currencyInfo}
          fiatLast
          fiatValue={fiatTotal}
          tokenAmount={nativeBalanceTotal}
          tokenSymbol={asset.symbol}
          tokenId={asset.id}
        />
      ) : (
        <DefiDetailsHeaderBalanceSimple balanceUsd={position.positionUsdValue} assets={position.assets} />
      )}
    </>
  );
};
