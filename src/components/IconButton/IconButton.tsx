import { BlurView, BlurViewProps } from '@react-native-community/blur';
import React, { Fragment } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { IconName, SvgIcon } from '@/components/SvgIcon';
import { Theme, useTheme } from '@/theme/themes';

export interface IconButtonProps {
  name: IconName;
  size?: number;
  onPress?: () => void;
  testID?: string;
  blurred?: boolean;
  backgroundColor?: keyof Theme['colors'];
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const blurProps: BlurViewProps = {
  blurAmount: 25,
  blurRadius: 25,
  blurType: 'light',
};

export const IconButton = ({ onPress, name, testID, blurred, size = 16, backgroundColor = 'light15', style, containerStyle }: IconButtonProps) => {
  const { colors } = useTheme();

  
  const { component: OptionalBlur, props: optionalBlurProps } =
    blurred && Platform.OS === 'ios'
      ? {
          component: BlurView,
          props: blurProps,
        }
      : {
          component: Fragment,
          props: {},
        };
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <OptionalBlur {...optionalBlurProps}>
        <SvgIcon onPress={onPress} name={name} size={size} testID={testID} style={[{ backgroundColor: colors[backgroundColor] }, styles.icon, style]} />
      </OptionalBlur>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  wrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
  },
});
