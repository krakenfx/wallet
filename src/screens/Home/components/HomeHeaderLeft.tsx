import React from 'react';
import { StyleSheet } from 'react-native';

import { GradientMask } from '@/components/Gradients';
import { SvgIcon } from '@/components/SvgIcon';

export const HomeHeaderLeft = () => {
  return <GradientMask element={<SvgIcon size={36} color="kraken" name="kraken" testID="LogoIcon" style={styles.icon} />} />;
};

const styles = StyleSheet.create({
  icon: {
    
    marginLeft: 27 - 18,
  },
});
