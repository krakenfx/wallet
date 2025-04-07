import type React from 'react';

import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { OverlappingCollection } from '@/components/OverlappingCollection';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useAppCurrency, useIsHideBalancesEnabled } from '@/realm/settings';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';

import { useTheme } from '@/theme/themes';
import { formatCurrency } from '@/utils/formatCurrency';

import { TokenIcon } from '../TokenIcon';

import type { DefiProtocolMultipleAssetsPositionRowProps } from './DefiProtocolPositions.types';

import loc from '/loc';

export const DefiProtocolMultipleAssetsPositionRow: React.FC<DefiProtocolMultipleAssetsPositionRowProps> = ({ positionUsdValue, isDebt, assets }) => {
  const { currency } = useAppCurrency();
  const { colors } = useTheme();
  const usdFiatRate = useCurrentUsdFiatRate();
  const valueInUserCurrency = usdFiatRate * positionUsdValue;

  const isHideBalancesEnabled = useIsHideBalancesEnabled();
  const formattedFiatAmount = useBalanceDisplay(formatCurrency(valueInUserCurrency, { currency, compact: true, hideDecimals: false }), 7);

  const icons = useMemo(() => {
    return assets.map(asset => <TokenIcon tokenId={asset.id} size={40} tokenSymbol={asset.symbol} forceOmitNetworkIcon />).reverse();
  }, [assets]);

  const assetsFormatted = assets.map(asset => asset.symbol).join(' / ');
  const ratios = useBalanceDisplay(assets.map(asset => `${Math.round(asset.portion * 100)}%`).join(' / '), 7);
  const color = isHideBalancesEnabled ? 'light50' : 'light100';

  const isDebtFormatted = isDebt ? loc.defi.debt + ' ' : '';
  const isDebtColor = isDebt ? 'yellow500' : 'green400';

  return (
    <View style={styles.container}>
      <OverlappingCollection
        itemSize={40}
        items={icons}
        itemsToShow={2}
        maskedItemOffset={18}
        hasMoreCountProps={{ backgroundColor: colors.kraken, fontSize: 15, fontColor: 'light75' }}
      />

      <View style={styles.metadataContainer}>
        <View style={styles.topContainer}>
          <View style={styles.assetsContainer}>
            <Label allowFontScaling={true} type="boldTitle2" color="light100" numberOfLines={1}>
              {assetsFormatted}
            </Label>
          </View>

          <Label type="boldLargeMonospace" color={color}>
            {formattedFiatAmount}
          </Label>
        </View>

        <View style={styles.bottomContainer}>
          <Label type="regularCaption1" color={isDebtColor}>
            {isDebtFormatted}
          </Label>
          <Label allowFontScaling type="regularCaption1" color="light50" numberOfLines={1} style={styles.ratios}>
            {ratios}
          </Label>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    flexDirection: 'row',
    gap: 8,
  },
  metadataContainer: {
    flex: 1,
    gap: 4,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  assetsContainer: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: 'row',
  },
  ratios: {
    maxWidth: '80%',
  },
});
