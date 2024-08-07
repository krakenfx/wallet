import React, { useState } from 'react';
import { LayoutRectangle } from 'react-native';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { Label, LabelProps } from '@/components/Label';

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
