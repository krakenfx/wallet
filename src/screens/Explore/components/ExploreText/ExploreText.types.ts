import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { AnimatedStyle } from 'react-native-reanimated';

import { TypographyKey } from '@/components/Label';
import { Theme } from '@/theme/themes';

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
