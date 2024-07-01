import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, TextProps, View, ViewStyle } from 'react-native';

import { useDeviceSize } from '@/hooks/useDeviceSize';

import { GradientLabel } from './Gradients';

export interface LargeHeaderProps {
  title: TextProps['children'];
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export const LargeHeader: React.FC<PropsWithChildren & LargeHeaderProps> = ({ title, testID, style, children }) => {
  const { size } = useDeviceSize();
  return (
    <View style={[styles.container, style, size === 'small' && styles.smallDeviceContainer]}>
      <GradientLabel
        containerStyle={styles.mainLabelContainer}
        style={styles.mainLabel}
        type="boldDisplay1"
        numberOfLines={1}
        adjustsFontSizeToFit={true}
        testID={`Title-${testID}`}>
        {title}
      </GradientLabel>
      <View style={styles.children}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 52,
    paddingHorizontal: 24,
  },
  smallDeviceContainer: {
    marginTop: 32,
  },
  mainLabel: {
    lineHeight: 64,
    minHeight: 65,
    width: '100%',
  },
  children: {
    marginTop: -6,
  },
  mainLabelContainer: {
    marginBottom: 4,
  },
  captionSecondary: {
    marginTop: 8,
  },
});
