import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { Label, LabelProps } from '../Label';

import { GradientMask } from './GradientMask';

type Props = LabelProps & {
  style?: StyleProp<Omit<TextStyle, keyof ViewStyle>>;
  containerStyle?: StyleProp<ViewStyle>;
};

export const GradientLabel: React.FC<Props> = ({ containerStyle, ...props }) => {
  return <GradientMask style={containerStyle} element={<Label {...props} />} />;
};
