import type { LayoutRectangle } from 'react-native';

import React, { useState } from 'react';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import type { LabelProps } from '@/components/Label';
import { Label } from '@/components/Label';

type Props = LabelProps & {
  scale: number;
};

export const ScalableLabel: React.FC<Props> = ({ scale, style, ...props }) => {
  const [layout, setLayout] = useState<LayoutRectangle>();

  const priceStyle = useAnimatedStyle(() => {
    if (!layout) {
      return {};
    }
    return {
      transform: [{ translateX: -layout.width / 2 }, { scale: withTiming(scale) }, { translateX: layout.width / 2 }],
    };
  });

  return <Label {...props} style={[style, priceStyle]} onLayout={e => setLayout(e.nativeEvent.layout)} />;
};
