import { StyleSheet, View } from 'react-native';

import { useTokenPriceChangePercentage } from '@/realm/tokenPrice';
import { getPercentageLabel } from '@/utils/formatPercentage';

import { Label } from '../Label';

const PRICE_CHANGE_PLACEHOLDER = '--';

export const AssetPriceChangeLabel = ({ assetId, testID }: { assetId: string; testID: string | undefined }) => {
  const priceChangePct = useTokenPriceChangePercentage({ assetId });
  const priceChangeLabel = getPercentageLabel(priceChangePct, 2, {
    placeholderColor: 'light50',
    placeholder: PRICE_CHANGE_PLACEHOLDER,
    truncateTrailingZeros: true,
  });

  return (
    <View style={styles.labelContainer} testID="AssetRowContent">
      <Label testID={`PriceChangeLabel-${testID}`} type="regularCaption1" color={priceChangeLabel.color} style={[styles.priceChangeLabel]}>
        {priceChangeLabel.label}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  label: {
    marginRight: 8,
  },
  priceChangeLabel: {
    alignItems: 'flex-start',
    textAlign: 'left',
    minWidth: 100,
  },
});
