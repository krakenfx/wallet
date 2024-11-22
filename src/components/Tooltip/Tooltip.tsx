import type { PropsWithChildren } from 'react';

import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { StyleSheet, View } from 'react-native';

import Animated, { type AnimatedProps } from 'react-native-reanimated';

import { useTheme } from '@/theme/themes';

import type { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';

export interface Props extends PropsWithChildren {
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  horizontalAlign?: 'left' | 'right';
  verticalAlign?: 'top' | 'bottom';
  horizontalTipOffset?: number;
  entering?: AnimatedProps<ViewProps>['entering'];
  exiting?: AnimatedProps<ViewProps>['exiting'];
}

const TIP_SIZE = 12;

export const Tooltip: React.FC<Props> = ({
  children,
  horizontalTipOffset = 32,
  containerStyle,
  horizontalAlign = 'right',
  verticalAlign = 'bottom',
  entering,
  exiting,
  style,
}) => {
  const { colors } = useTheme();

  const horizontalStyle = { [horizontalAlign]: horizontalTipOffset };
  const verticalStyle = verticalAlign === 'top' ? styles.tipBottom : styles.tipTop;
  const tipStyle: StyleProp<ViewStyle> = [horizontalStyle, verticalStyle];

  return (
    <Animated.View entering={entering} exiting={exiting} style={containerStyle}>
      <View style={[styles.tip, { backgroundColor: colors.tooltipColor }, tipStyle]} />
      <View style={[styles.content, { backgroundColor: colors.tooltipColor }, style]}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tip: {
    width: TIP_SIZE,
    height: TIP_SIZE,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
  },
  tipTop: {
    top: -TIP_SIZE / 2,
  },
  tipBottom: {
    bottom: -TIP_SIZE / 2,
  },
  content: {
    borderRadius: 12,
    padding: 16,
  },
});
