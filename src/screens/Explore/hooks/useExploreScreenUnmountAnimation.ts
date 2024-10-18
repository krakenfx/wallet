import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { SpringConfig } from 'react-native-reanimated/lib/typescript/reanimated2/animation/springUtils';

const SPRING_CONFIG: SpringConfig = {
  mass: 1,
  stiffness: 1125,
  damping: 75,
};

export const useExploreScreenUnmountAnimation = () => {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerShown: true,
      });

      translateY.value = withSpring(0, SPRING_CONFIG);
    }, []),
  );

  const animateScreenUnmount = () => {
    navigation.setOptions({
      headerShown: false,
    });

    translateY.value = withSpring(height, SPRING_CONFIG);
  };

  return {
    animatedStyle,
    animateScreenUnmount,
  };
};
