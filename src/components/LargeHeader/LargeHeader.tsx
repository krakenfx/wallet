import type { PropsWithChildren } from 'react';

import type React from 'react';
import type { StyleProp, TextProps, ViewStyle } from 'react-native';

import { StyleSheet, View } from 'react-native';

import { GradientLabel } from '@/components/Gradients';
import { useDeviceSize } from '@/hooks/useDeviceSize';

export interface LargeHeaderProps {
  title: TextProps['children'];
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export const LargeHeader: React.FC<PropsWithChildren & LargeHeaderProps> = ({ title, testID, style, children }) => {
  const { size } = useDeviceSize();
  return (
    <View style={[styles.container, size === 'small' && styles.smallDeviceContainer, style]}>
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
    marginTop: 24,
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
