import React, { useMemo, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type Props = Animated.AnimatedScrollViewProps & {
  onRefresh: () => void;
  refreshThreshold?: number;
  stiffness?: number;
};

export const RefreshControlScrollViewAndroid: React.FC<Props> = ({ children, style, stiffness = 20, refreshThreshold = 30, onRefresh, ...props }) => {
  const animatedRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(animatedRef);

  const panValue = useSharedValue(0);
  const hasTriggered = useSharedValue(false);

  const translateStyle = useAnimatedStyle(() => ({ transform: [{ translateY: panValue.value }] }), []);

  const [panEnabled, setPanEnabled] = useState(true);

  useAnimatedReaction(
    () => scrollOffset.value <= 0,
    (canPan, prev) => {
      if (prev !== canPan) {
        runOnJS(setPanEnabled)(canPan);
      }
    },
    [scrollOffset],
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(panEnabled)
        .minDistance(5)
        .failOffsetY(-1)
        .onChange(e => {
          const newValue = panValue.value + e.changeY;
          const progress = 1 / (newValue / stiffness);
          const interpolationFactor = Math.max(0, Math.min(progress, 1));
          panValue.value = panValue.value + e.changeY * interpolationFactor;
          if (newValue > refreshThreshold && !hasTriggered.value) {
            hasTriggered.value = true;
            runOnJS(onRefresh)();
          }
        })
        .onEnd(() => {
          panValue.value = withSpring(0, { overshootClamping: true });
          hasTriggered.value = false;
        }),
    [panValue, hasTriggered, stiffness, onRefresh, panEnabled, refreshThreshold],
  );

  return (
    <Animated.ScrollView ref={animatedRef} style={[style, translateStyle]} {...props}>
      <GestureDetector gesture={gesture}>
        <Animated.View>{children}</Animated.View>
      </GestureDetector>
    </Animated.ScrollView>
  );
};
