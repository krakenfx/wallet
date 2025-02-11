import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { useTheme } from '@/theme/themes';

import { useDefiDetailsContext } from './DefiDetailsContext';
import { DefiDetailsInfoItem } from './DefiDetailsInfoItem';

import loc from '/loc';

export const DefiDetailsInfoAsset = () => {
  const { assetPrice, assetMarketCap, assetSymbol } = useDefiDetailsContext();
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} testID="DefiDetailsVaultInfo">
      <Label style={styles.heading} type="boldTitle2">
        {loc.formatString(loc.earn.detailsSheet.info.about, { symbol: assetSymbol })}
      </Label>
      <View style={[styles.container, { backgroundColor: colors.dark15 }]}>
        <View style={styles.column}>
          <DefiDetailsInfoItem label={loc.earn.detailsSheet.info.tokenPrice} value={assetPrice} />
        </View>
        <View style={styles.column}>
          <DefiDetailsInfoItem label={loc.earn.detailsSheet.info.marketCap} value={assetMarketCap} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 12,
    paddingLeft: 16,
    gap: 16,
    borderRadius: 16,
  },
  column: {
    flex: 1,
  },
  heading: {
    marginBottom: 12,
  },
});
