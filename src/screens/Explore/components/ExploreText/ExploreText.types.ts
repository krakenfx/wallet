import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { AnimatedStyle } from 'react-native-reanimated';

import type { TypographyKey } from '@/components/Label';
import type { Theme } from '@/theme/themes';

export type TextColor = keyof Theme['colors'];
export type ExploreTextProps = {
  title?: string;
  body?: string;
  style?: StyleProp<ViewStyle>;
  titleType?: TypographyKey;
  titleStyle?: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
  titleColor?: TextColor;
  bodyType?: TypographyKey;
  bodyStyle?: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
  bodyColor?: TextColor;
};
