import { StyleSheet, View } from 'react-native';

import { SvgIcon } from '@/components/SvgIcon';
import { useTheme } from '@/theme/themes';

export const KrakenIcon = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.kraken }]}>
      <SvgIcon name="kraken" size={10} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 32,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
