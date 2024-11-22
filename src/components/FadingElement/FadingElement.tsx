import type { PropsWithChildren } from 'react';

import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { LinearGradientProps } from 'react-native-svg';

import MaskedView from '@react-native-masked-view/masked-view';
import { Fragment } from 'react';

import { Platform, StyleSheet, View } from 'react-native';

import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

const FadingElementIOS: React.FC<PropsWithChildren<Omit<LinearGradientProps, 'children'>> & { containerStyle?: StyleProp<ViewStyle> }> = ({
  children,
  containerStyle,
  ...props
}) => {
  return (
    <MaskedView
      style={containerStyle}
      maskElement={
        <Svg viewBox="0 0 100 100" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="fadingGradient" x1="100%" x2="100%" y1="0%" y2="2%" gradientUnits="userSpaceOnUse" {...props}>
              <Stop offset="0%" stopOpacity={0} />
              <Stop offset="100%" stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#fadingGradient)" />
        </Svg>
      }>
      <View style={styles.content}>{children}</View>
    </MaskedView>
  );
};

export const FadingElement = Platform.select({ ios: FadingElementIOS, default: Fragment });

const styles = StyleSheet.create({
  content: {
    height: '100%',
    width: '100%',
  },
});
