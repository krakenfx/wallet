import type React from 'react';

import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

import { useAssetMetadata } from '@/realm/assetMetadata';
import { useAppCurrency } from '@/realm/settings';
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

  const formattedFiatAmount = formatCurrency(valueInUserCurrency, { currency, compact: true, hideDecimals: false });

  const tokenAmount = unitConverter.smallUnit2TokenUnit(balanceNative, asset.decimals).toString(10);
  const tokenAmountFormatted = formatTokenAmount(tokenAmount, { compact: true, currency });

  return (
    <View style={styles.container}>
      <View style={styles.metadataContainer}>
        <TokenIcon tokenId={assetId} tokenSymbol={asset.symbol} networkName={networkName} />

        <View style={styles.textContainer}>
          <Label type="boldTitle2" color="light100">
            {metadata?.label}
          </Label>

          <Label type="regularCaption1" color={isDebt ? 'yellow500' : 'green400'}>
            {isDebt ? `${loc.defi.debt} ${apy ? `· ` : ''}` : ''}
            {apy ? `${apy}% ${loc.defi.apy}` : ''}
          </Label>
        </View>
      </View>

      <View style={styles.valueContainer}>
        <Label type="boldLargeMonospace" color="light100">
          {formattedFiatAmount}
        </Label>

        <Label type="regularCaption1" color="light50">
          {isDebt ? '-' : ''}
          {tokenAmountFormatted} {metadata?.symbol}
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
