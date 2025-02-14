import { StyleSheet, View } from 'react-native';

import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import type { ColorName } from '@/theme/themes';
import { useTheme } from '@/theme/themes';

import loc from '/loc';

interface Props {
  color: ColorName;
  currentValue?: number;
  high: number;
  highLabel: string;
  low: number;
  lowLabel: string;
}

export const HighLowChange = ({ color, currentValue, high, highLabel, low, lowLabel }: Props) => {
  const currentValue_ = Number(currentValue || 0);
  const { colors } = useTheme();

  const style = useAnimatedStyle(() => {
    const value = ((currentValue_ - low) / (high - low || 1)) * 100;
    return {
      width: withTiming(`${value}%`),
      backgroundColor: withTiming(colors[color]),
    };
  });

  const hasLowHighValues = !!low && !!high;

  return (
    <View style={styles.container} testID="HighLowPriceChange">
      <View style={[styles.lineArea, { backgroundColor: colors.purple_40 }]}>
        <Animated.View style={[styles.lineValue, style]} />
      </View>
      <View style={styles.rowWithLabels}>
        {hasLowHighValues && (
          <>
            <View style={styles.label}>
              <Label type="regularCaption1" color="light75">
                {`${loc._.low} `}
              </Label>
              <Label type="boldCaption1" color="light100">
                {lowLabel}
              </Label>
            </View>
            <View style={styles.label}>
              <Label type="regularCaption1" color="light75">
                {`${loc._.high} `}
              </Label>
              <Label type="boldCaption1" color="light100">
                {highLabel}
              </Label>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  rowWithLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 17,
  },
  lineArea: {
    height: 6,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  label: {
    flexDirection: 'row',
  },
  lineValue: {
    position: 'absolute',
    height: '100%',
    borderRadius: 12,
  },
});
