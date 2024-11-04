import type { StyleProp, ViewStyle } from 'react-native';

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import type { ColorName } from '@/theme/themes';
import { useTheme } from '@/theme/themes';

type Props = {
  totalBars: number;
  currentBar: number;
  activeColor: ColorName;
  containerStyle?: StyleProp<ViewStyle>;
};

const LevelBar: React.FC<{
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
  activeColor: string;
  inactiveColor: string;
}> = ({ isActive, isFirst, isLast, activeColor, inactiveColor }) => {
  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isActive ? activeColor : inactiveColor),
  }));

  return <Animated.View style={[styles.levelBar, isFirst && styles.levelFirstBar, isLast && styles.levelLastBar, backgroundStyle]} />;
};

export const ProgressBar: React.FC<Props> = ({ totalBars, currentBar, activeColor, containerStyle }) => {
  const { colors } = useTheme();

  const levels = useMemo(() => new Array(totalBars).fill(0), [totalBars]);

  return (
    <View style={[styles.row, containerStyle]}>
      {levels.map((_, i) => (
        <LevelBar
          key={i}
          isActive={i <= currentBar - 1}
          isFirst={i === 0}
          isLast={i === levels.length - 1}
          inactiveColor={colors.light15}
          activeColor={colors[activeColor]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  levelBar: {
    flex: 1,
    height: 7,
    marginHorizontal: 2.5,
  },
  levelFirstBar: {
    marginLeft: 0,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  levelLastBar: {
    marginRight: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
});
