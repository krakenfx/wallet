import AnimatedLottieView from 'lottie-react-native';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

type Props = {
  size?: number;
  style?: StyleProp<ViewStyle>;
};
export const ActivityIndicator = ({ size = 24, style }: Props) => {
  return <AnimatedLottieView testID="ActivityIndicator" autoPlay source={require('./spinner.json')} style={[{ width: size, height: size }, style]} />;
};
