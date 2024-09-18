import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { Easing, SharedValue, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

interface Props {
  isExpanded: SharedValue<boolean>;
  children: React.ReactElement | React.ReactElement[];
  style?: ViewStyle;
  duration?: number;
}



export function AccordionItem({ isExpanded, children, style, duration = 300 }: Props) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
      easing: Easing.in(Easing.linear),
    }),
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View style={[styles.animatedView, bodyStyle, style]}>
      <View
        onLayout={e => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={styles.wrapper}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
  },
  animatedView: {
    width: '100%',
    overflow: 'hidden',
  },
});
