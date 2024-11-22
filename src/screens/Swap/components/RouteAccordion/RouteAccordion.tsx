import type React from 'react';

import { type PropsWithChildren } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AccordionItem } from '@/components/AccordionItem';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

export type RouteAccordionProps = PropsWithChildren & {
  roundedTop?: boolean;
  roundedBottom?: boolean;
  leftElement?: string;
  rightElement?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

const ANIMATION_DURATION = 150;
const ACCORDION_RADIUS = 12;

export const RouteAccordion: React.FC<RouteAccordionProps> = ({ leftElement, rightElement, roundedTop, roundedBottom, children, style, contentStyle }) => {
  const isExpanded = useSharedValue(false);

  const { colors } = useTheme();

  const onToggle = () => {
    isExpanded.value = !isExpanded.value;
  };

  const containerBgStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(isExpanded.value ? colors.purple_20 : colors.purple_10, { duration: ANIMATION_DURATION }),
    };
  }, []);

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withTiming(isExpanded.value ? '180deg' : '0deg', { duration: ANIMATION_DURATION }),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, containerBgStyle, roundedTop && styles.roundedTop, roundedBottom && styles.roundedBottom, style]}>
      <Touchable onPress={onToggle} style={styles.header}>
        <View style={styles.headerContent}>
          <Label type="boldCaption1">{leftElement}</Label>
          <Label type="boldCaption1">{rightElement}</Label>
        </View>
        <SvgIcon name="chevron-down" style={chevronStyle} />
      </Touchable>
      <AccordionItem isExpanded={isExpanded} duration={ANIMATION_DURATION}>
        <View style={contentStyle}>{children}</View>
      </AccordionItem>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  roundedTop: {
    borderTopLeftRadius: ACCORDION_RADIUS,
    borderTopRightRadius: ACCORDION_RADIUS,
  },
  roundedBottom: {
    borderBottomLeftRadius: ACCORDION_RADIUS,
    borderBottomRightRadius: ACCORDION_RADIUS,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    marginRight: 4,
  },
});
