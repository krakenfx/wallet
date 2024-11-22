import type { FC } from 'react';

import { BlurView } from '@react-native-community/blur';

import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import Animated, { FadeInDown, FadeOutDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { SvgIcon } from '@/components/SvgIcon';
import { useTheme } from '@/theme/themes';

import type { ExploreTabBarProps, TabData } from './ExploreTabBar.types';

const TabBarSizes = {
  width: 212,
  height: 64,
  radius: 70,
  bottomOffset: 50,
};

const tabCount = 3;

const svgHitSlop = { top: 16, bottom: 16, left: 0, right: 0 };

const getGlowXPosition = (tabIndex: number): number => {
  return TabBarSizes.radius * ((tabIndex % tabCount) - 1);
};

export const ExploreTabBar: FC<ExploreTabBarProps> = ({
  leftIconName,
  centerIconName,
  rightIconName,
  onTabLeftPress,
  onTabCenterPress,
  onTabRightPress,
  activeTab = 0,
  showTabs,
}) => {
  const { colors } = useTheme();
  const glowX = useSharedValue(getGlowXPosition(activeTab));
  const tabs: TabData[] = [
    { name: leftIconName, onPress: onTabLeftPress },
    { name: centerIconName, onPress: onTabCenterPress },
    { name: rightIconName, onPress: onTabRightPress },
  ];
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(glowX.value) }],
  }));

  useEffect(() => {
    glowX.value = getGlowXPosition(activeTab);
  }, [activeTab, glowX]);

  if (!showTabs) {
    return null;
  }

  return (
    <View style={styles.container} testID="ExploreTabBar">
      <Animated.View style={styles.animatedContainer} entering={FadeInDown.duration(150)} exiting={FadeOutDown.duration(150)}>
        {Platform.OS === 'ios' ? (
          <BlurView blurType="ultraThinMaterialDark" reducedTransparencyFallbackColor={colors.background} style={[StyleSheet.absoluteFill]} />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.blurBackgroundAndroid }]} />
        )}
        <GradientItemBackground style={styles.background} />
        <View style={styles.iconContainer}>
          {tabs.map((tab: TabData, index: number) => {
            const iconColor = activeTab === index ? 'light100' : 'light50';
            return (
              <SvgIcon color={iconColor} name={tab.name} onPress={tab.onPress} hitSlop={svgHitSlop} testID={`ExploreIcon-${tab.name}`} key={`{name}${index}`} />
            );
          })}
        </View>
        <View pointerEvents="none">
          <Animated.Image source={require('./assets/glow.png')} style={[styles.glow, animatedStyles]} resizeMode="contain" />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: TabBarSizes.width,
    height: TabBarSizes.height,
    zIndex: 1,
    bottom: TabBarSizes.bottomOffset,
    left: '50%',
    backgroundColor: 'transparent',
    transform: [{ translateX: TabBarSizes.width / -2 }],
  },
  animatedContainer: {
    width: TabBarSizes.width,
    height: TabBarSizes.height,
    borderRadius: TabBarSizes.radius,
    overflow: 'hidden',
  },
  background: {
    width: TabBarSizes.width,
    height: TabBarSizes.height,
    borderRadius: TabBarSizes.radius,
    opacity: 0.5,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: TabBarSizes.height / 2,
    height: TabBarSizes.height,
  },
  glow: {
    width: TabBarSizes.width,
    position: 'absolute',
    bottom: -40,
  },
});
