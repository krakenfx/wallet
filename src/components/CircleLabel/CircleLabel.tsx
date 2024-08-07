import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

type Props = { backgroundColor: string; circleSize: number; fontSize: number; text: string | (string | number)[] };

export const CircleLabel = ({ backgroundColor, circleSize, fontSize, text }: Props) => {
  return (
    <View style={[styles.circle, { backgroundColor, borderRadius: circleSize / 2, height: circleSize, width: circleSize }]}>
      <Label style={{ fontSize }} type="boldCaption1" adjustsFontSizeToFit>
        {text}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
