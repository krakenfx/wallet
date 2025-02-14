import type React from 'react';

import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

import { useAppCurrency } from '@/realm/settings';

import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';

import { useTheme } from '@/theme/themes';
import { formatCurrency } from '@/utils/formatCurrency';

import { OverlappingCollection } from '../OverlappingCollection';

import { TokenIcon } from '../TokenIcon';

import type { DefiProtocolMultipleAssetsPositionRowProps } from './DefiProtocolPositions.types';

import loc from '/loc';

export const DefiProtocolMultipleAssetsPositionRow: React.FC<DefiProtocolMultipleAssetsPositionRowProps> = ({ positionUsdValue, isDebt, assets }) => {
  const { currency } = useAppCurrency();
  const { colors } = useTheme();
  const usdFiatRate = useCurrentUsdFiatRate();
  const valueInUserCurrency = usdFiatRate * positionUsdValue;

  const formattedFiatAmount = formatCurrency(valueInUserCurrency, { currency, compact: true, hideDecimals: false });

  const icons = useMemo(() => {
    return assets.map(asset => <TokenIcon tokenId={asset.id} size={40} tokenSymbol={asset.symbol} forceOmitNetworkIcon />);
  }, [assets]);

  return (
    <View style={styles.container}>
      <OverlappingCollection
        itemSize={40}
        items={icons}
        itemsToShow={4}
        maskedItemOffset={18}
        hasMoreCountProps={{ backgroundColor: colors.purple_40, fontSize: 15 }}
      />

      <View style={styles.metadataContainer}>
        <View style={styles.topContainer}>
          <View style={styles.assetsContainer}>
            <Label allowFontScaling={true} type="boldTitle2" color="light100" numberOfLines={1}>
              {assets.map(asset => asset.symbol).join(' / ')}
            </Label>
          </View>

          <Label type="boldLargeMonospace" color="light100">
            {formattedFiatAmount}
          </Label>
        </View>

        <View style={styles.bottomContainer}>
          <Label type="regularCaption1" color={isDebt ? 'yellow500' : 'green400'}>
            {isDebt ? loc.defi.debt : ''}
          </Label>
          <Label allowFontScaling type="regularCaption1" color="light50" numberOfLines={1}>
            {assets.map(asset => `${Math.round(asset.portion * 100)}%`).join(' / ')}
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
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
