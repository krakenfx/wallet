import type { StyleProp, ViewStyle } from 'react-native';

import type Animated from 'react-native-reanimated';
import type { StopProps } from 'react-native-svg';

import { type ComponentProps } from 'react';

import { useTheme } from '@/theme/themes';

import { GradientBaseBackground } from './GradientBaseBackground';

export type GradientPromoBackgroundProps = Pick<ComponentProps<typeof Animated.View>, 'entering' | 'exiting'> & {
  style?: StyleProp<ViewStyle>;
};

export const GradientPromoBackground: React.FC<GradientPromoBackgroundProps> = ({ style, ...viewProps }) => {
  const {
    gradients: { promoBackground },
  } = useTheme();

  const stops: StopProps[] = [
    { offset: '0%', stopColor: promoBackground.stop1, stopOpacity: 0.75 },
    { offset: '100%', stopColor: promoBackground.stop2, stopOpacity: 0.75 },
  ];

  return <GradientBaseBackground stops={stops} style={style} {...viewProps} y1={'5%'} y2={'95%'} />;
};
