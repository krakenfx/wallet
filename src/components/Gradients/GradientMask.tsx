import MaskedView from '@react-native-masked-view/masked-view';
import React, { useState } from 'react';
import { LayoutChangeEvent, LayoutRectangle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

type MaskedGradientProps = {
  element: React.ReactElement;
  style?: StyleProp<ViewStyle>;
};

export const GradientMask: React.FC<MaskedGradientProps> = ({ element, style }) => {
  const [layout, setLayout] = useState<LayoutRectangle>();

  const onLayout = (e: LayoutChangeEvent) => setLayout(e.nativeEvent.layout);

  const elementToMeasure = React.cloneElement(element, {
    onLayout: (e: LayoutChangeEvent) => {
      element.props?.onLayout?.(e);
      onLayout(e);
    },
  });

  return (
    <MaskedView maskElement={element} style={style}>
      <View style={[layout && { width: layout.width }, styles.row, element.props.style]}>
        {elementToMeasure}
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="linearGradient" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="rgb(117,45,245)" />
              <Stop offset="100%" stopColor="rgb(138,86,246)" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#linearGradient)" />
        </Svg>
      </View>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
