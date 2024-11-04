import type { StyleProp, ViewStyle } from 'react-native';

import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { interpolate, useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { FadingElement } from '@/components/FadingElement';
import { ControlledToggle } from '@/components/Toggle';
import { hapticFeedback } from '@/utils/hapticFeedback';

type ViewPagerPage = {
  label: string;
  testID?: string;
  component: React.ReactElement;
};

type ViewPagerProps = {
  left: ViewPagerPage;
  right: ViewPagerPage;
  
  secondaryComponent?: React.ReactElement;
  toggleTestID?: string;
  containerStyle?: StyleProp<ViewStyle>;
};
export const ViewPager: React.FC<ViewPagerProps> = ({ secondaryComponent, left, right, toggleTestID, containerStyle }) => {
  const dimensions = useWindowDimensions();
  const toggleState = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollHandler = useAnimatedScrollHandler(event => {
    toggleState.value = interpolate(event.contentOffset.x, [0, dimensions.width], [0, 1]);
  });

  const onToggleTap = () => {
    scrollRef.current?.scrollTo({ x: toggleState.value ? 0 : dimensions.width });
    hapticFeedback.impactLight();
  };
  return (
    <View style={styles.container}>
      <ControlledToggle
        leftText={left.label}
        leftTestID={left.testID}
        rightText={right.label}
        rightTestID={right.testID}
        testID={toggleTestID}
        animation={toggleState}
        onTap={onToggleTap}
        containerStyle={styles.toggle}
      />
      {secondaryComponent}
      <FadingElement containerStyle={[styles.fadingElement, containerStyle]}>
        <Animated.ScrollView
          decelerationRate="fast"
          ref={scrollRef}
          scrollEventThrottle={16}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}>
          <View style={{ width: dimensions.width }}>{left.component}</View>
          <View style={{ width: dimensions.width }}>{right.component}</View>
        </Animated.ScrollView>
      </FadingElement>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fadingElement: {
    flex: 1,
  },
  toggle: {
    marginTop: 8,
    marginBottom: 8,
  },
});
