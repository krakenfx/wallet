import type { StyleProp, ViewStyle } from 'react-native';

import { BlurView } from '@react-native-community/blur';
import { Fragment } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import type { IconName } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';
import type { Theme } from '@/theme/themes';
import { useTheme } from '@/theme/themes';

import type { BlurViewProps } from '@react-native-community/blur';

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
