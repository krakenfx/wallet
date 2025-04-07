import type React from 'react';

import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';

import { useAssetMetadata } from '@/realm/assetMetadata';
import { useAppCurrency, useIsHideBalancesEnabled } from '@/realm/settings';
import { getNetworkNameFromAssetId } from '@/realm/tokens';

import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';

import { formatCurrency } from '@/utils/formatCurrency';

import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { unitConverter } from '@/utils/unitConverter';

import { TokenIcon } from '../TokenIcon';

import type { DefiProtocolSingleAssetPositionRowProps } from './DefiProtocolPositions.types';

import loc from '/loc';

export const DefiProtocolSingleAssetPositionRow: React.FC<DefiProtocolSingleAssetPositionRowProps> = ({ isDebt, apy, asset }) => {
  const { id: assetId, balanceNative, balanceUsd } = asset;

  const networkName = getNetworkNameFromAssetId(assetId);
  const metadata = useAssetMetadata({ assetId });

  const { currency } = useAppCurrency();
  const usdFiatRate = useCurrentUsdFiatRate();
  const valueInUserCurrency = usdFiatRate * balanceUsd;

  const isHideBalancesEnabled = useIsHideBalancesEnabled();
  const formattedFiatAmount = useBalanceDisplay(formatCurrency(valueInUserCurrency, { currency, compact: true, hideDecimals: false }), 7);
  const fiatAmountColor = isHideBalancesEnabled ? 'light50' : 'light100';

  const tokenAmount = unitConverter.smallUnit2TokenUnit(balanceNative, asset.decimals).toString(10);
  const tokenAmountFormatted = useBalanceDisplay(`${formatTokenAmount(tokenAmount, { compact: true, currency })} ${metadata?.symbol ?? ''}`, 7);
  const tokenAmountFormattedIsDebt = isDebt ? '-' : '';

  const apyLabel = apy ? `${apy}% ${loc.defi.apy}` : '';
  const isDebtLabel = isDebt ? `${loc.defi.debt} ${apy ? `· ` : ''}` : '';
  const isDebtColor = isDebt ? 'yellow500' : 'green400';

  return (
    <View style={styles.container}>
      <View style={styles.metadataContainer}>
        <TokenIcon tokenId={assetId} tokenSymbol={asset.symbol} networkName={networkName} />

        <View style={styles.textContainer}>
          <Label type="boldTitle2" color="light100">
            {metadata?.label}
          </Label>

          <Label type="regularCaption1" color={isDebtColor}>
            {isDebtLabel}
            {apyLabel}
          </Label>
        </View>
      </View>

      <View style={styles.valueContainer}>
        <Label type="boldLargeMonospace" color={fiatAmountColor}>
          {formattedFiatAmount}
        </Label>

        <Label type="regularCaption1" color="light50">
          {tokenAmountFormattedIsDebt}
          {tokenAmountFormatted}
        </Label>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  metadataContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  valueContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 1,
  },
});
