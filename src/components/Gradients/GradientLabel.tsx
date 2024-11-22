import type React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { LabelProps } from '@/components/Label';
import { Label } from '@/components/Label';

import { GradientMask } from './GradientMask';

type Props = LabelProps & {
  style?: StyleProp<Omit<TextStyle, keyof ViewStyle>>;
  containerStyle?: StyleProp<ViewStyle>;
};

export const GradientLabel: React.FC<Props> = ({ containerStyle, ...props }) => {
  return <GradientMask style={containerStyle} element={<Label {...props} />} />;
};
