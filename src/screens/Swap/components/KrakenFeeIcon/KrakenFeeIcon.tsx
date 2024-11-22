import type React from 'react';

import { StyleSheet } from 'react-native';

import { SvgIcon } from '@/components/SvgIcon';
import { useTheme } from '@/theme/themes';

export const KrakenFeeIcon: React.FC = () => {
  const { colors } = useTheme();

  return <SvgIcon style={[styles.krakenLogo, { backgroundColor: colors.kraken }]} name="kraken" size={10} />;
};

const styles = StyleSheet.create({
  krakenLogo: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
