import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import type { Theme } from '@/theme/themes';

type Props = { backgroundColor: string; circleSize: number; fontColor?: keyof Theme['colors']; fontSize: number; text: string | (string | number)[] };

export const CircleLabel = ({ backgroundColor, circleSize, fontColor, fontSize, text }: Props) => {
  return (
    <View style={[styles.circle, { backgroundColor, borderRadius: circleSize / 2, height: circleSize, width: circleSize }]}>
      <Label style={{ fontSize }} type="boldCaption1" color={fontColor} adjustsFontSizeToFit>
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
