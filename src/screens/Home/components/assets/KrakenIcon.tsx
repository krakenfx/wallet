import { StyleSheet, View } from 'react-native';

import { SvgIcon } from '@/components/SvgIcon';
import { useTheme } from '@/theme/themes';

interface Props {
  size?: number;
}

export const KrakenIcon = ({ size = 16 }: Props) => {
  const { colors } = useTheme();
  const style = { width: size, height: size };
  return (
    <View style={[styles.container, { backgroundColor: colors.kraken }, style]}>
      <SvgIcon name="kraken" size={10} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
