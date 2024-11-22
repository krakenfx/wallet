import { StyleSheet } from 'react-native';

import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

export const ExploreCardContrastOverlay = ({ width, height }: { width: number; height: number }) => {
  const radialX = width / 2;
  const radialY = height / 2;

  const transform = `translate(${radialX} ${radialY}) rotate(-90) scale(${radialY} ${radialX})`;
  return (
    <Svg style={[StyleSheet.absoluteFill, styles.contrast]}>
      <Defs>
        <RadialGradient id="paint0_radial_3888_4537" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={transform}>
          <Stop offset="0.432968" stopColor="#666666" stopOpacity="0.1" />
          <Stop offset="1" stopColor="#160534" stopOpacity="0.8" />
        </RadialGradient>
        <LinearGradient id="paint1_linear_3888_4537" x1="0" y1="0" x2="0" y2={`${height}`} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopOpacity="0" />
          <Stop offset="1" stopColor="#160534" stopOpacity="0.75" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#paint0_radial_3888_4537)" fillOpacity="0.3" />
      <Rect width="100%" height="100%" fill="url(#paint1_linear_3888_4537)" fillOpacity="0.6" />
    </Svg>
  );
};

const styles = StyleSheet.create({
  contrast: { position: 'absolute', overflow: 'hidden', backgroundColor: 'transparent' },
});
