import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { AddressDisplayOneLine } from '@/components/AddressDisplay';
import { Label } from '@/components/Label';
import { useTheme } from '@/theme/themes';

import { useDefiDetailsContext } from '../DefiDetailsContext';

import loc from '/loc';

export const DefiDetailsInfoContractAddress = () => {
  const { vaultAddress } = useDefiDetailsContext();
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} testID="DefiDetailsVaultInfo">
      <Label style={styles.heading} type="boldTitle2">
        {loc.earn.detailsSheet.info.poolAddress}
      </Label>
      <View style={[styles.container, { backgroundColor: colors.dark15 }]}>
        <AddressDisplayOneLine address={vaultAddress} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 4,
    paddingLeft: 16,
    gap: 16,
    borderRadius: 16,
  },
  heading: {
    marginBottom: 16,
  },
});
