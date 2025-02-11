import type { IconProps } from 'react-icomoon';

import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import type { AnimatedProps } from 'react-native-reanimated';

import IcoMoon from 'react-icomoon';

import { StyleSheet, View } from 'react-native';

import Animated from 'react-native-reanimated';
import { Path, Svg } from 'react-native-svg';

import { Label } from '@/components/Label';
import type { TouchableProps } from '@/components/Touchable';
import { Touchable } from '@/components/Touchable';
import type { ColorName } from '@/theme/themes';
import { useTheme } from '@/theme/themes';

import { GradientIconBackground } from './GradientIconBackground';
import iconSet from './selection.json';

import type { IconName } from './types';

const DEFAULT_HIT_SLOP = 6;

export type NonSmallIconName = Exclude<IconName, `small-${string}`>;
export type { NonSmallIconName as IconName };

export interface SvgIconProps extends Pick<IconProps, 'disableFill' | 'removeInlineStyle'>, Pick<AnimatedProps<ViewProps>, 'entering' | 'exiting' | 'layout'> {
  name: NonSmallIconName;
  color?: ColorName;
  bgColor?: ColorName;
  size?: number;
  label?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  hitSlop?: TouchableProps['hitSlop'];
  gradientIconBackground?: boolean;
}

export const SvgIcon = ({
  color = 'light100',
  size = 24,
  name,
  label,
  onPress,
  onLongPress,
  bgColor,
  testID,
  style,
  disabled,
  entering,
  exiting,
  layout,
  hitSlop = DEFAULT_HIT_SLOP,
  gradientIconBackground,
  ...otherProps
}: SvgIconProps) => {
  const theme = useTheme();
  const themeColor = !disabled ? theme.colors[color] : theme.colors.light15;

  const icon: IconName = size <= 17 ? `small-${name}` : name;

  const containerStyle = [style, !!label && styles.styleWithLabel];

  const content = (
    <>
      <IcoMoon native SvgComponent={Svg} PathComponent={Path} icon={icon} iconSet={iconSet} {...otherProps} size={size} color={themeColor} />
      {!!label && <Label type="boldCaption1">{label}</Label>}
    </>
  );

  if (onPress || onLongPress) {
    return (
      <Touchable
        testID={testID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={containerStyle}
        hitSlop={hitSlop}
        entering={entering}
        exiting={exiting}
        layout={layout}>
        {content}
      </Touchable>
    );
  }

  return (
    <Animated.View testID={testID} style={containerStyle} entering={entering} exiting={exiting} layout={layout}>
      {gradientIconBackground && <GradientIconBackground />}
      {bgColor ? (
        <View
          style={[
            styles.absolute,
            {
              backgroundColor: theme.colors[bgColor],
              width: size / 2,
              height: size / 2,
              top: size / 4,
              left: size / 4,
            },
          ]}
        />
      ) : null}
      {content}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
  styleWithLabel: {
    alignItems: 'center',
  },
});
