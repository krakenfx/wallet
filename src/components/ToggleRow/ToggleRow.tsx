import type { PropsWithChildren } from 'react';

import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Touchable } from '@/components/Touchable';

interface ToggleRowProps {
  onPress: () => void;
  selected?: boolean;
  testID?: string;
}

export const ToggleRow = ({ children, onPress, selected, testID }: PropsWithChildren<ToggleRowProps>) => {
  const selectionStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(selected ? 1 : 0),
    }),
    [selected],
  );

  return (
    <Touchable onPress={onPress} testID={testID}>
      <Animated.View style={[styles.wrapper]}>
        {selected && <GradientItemBackground style={selectionStyle} />}
        {children}
      </Animated.View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
});
