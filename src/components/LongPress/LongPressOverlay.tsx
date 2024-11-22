import { BlurView } from '@react-native-community/blur';
import { useCallback } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

import { useAndroidBackButton } from '@/utils/useAndroidBackButton';

import { useLongPress } from './LongPressContext';
import { LongPressOptionItem } from './LongPressOptionItem';

export const LongPressOverlay = () => {
  const { selectedItem, onPressOut, animatedStyle, options, overlayStyle, animatedOptionsStyle, styles: itemStyles } = useLongPress();
  const { colors } = useTheme();
  useAndroidBackButton(() => {
    if (selectedItem) {
      onPressOut();
      return true;
    }
    return false;
  });

  const onItemPress = useCallback(
    (onPress?: () => void) => {
      onPressOut(false, onPress);
    },
    [onPressOut],
  );

  const handlePressOut = () => {
    onPressOut();
  };

  const renderOptions = useCallback(
    () => (
      <Animated.View style={[styles.options, animatedOptionsStyle]}>
        {options.map((item, index) => (
          <LongPressOptionItem key={index} text={item.text} iconName={item.iconName} spaceBelow={item.spaceBelow} onPress={() => onItemPress(item.onPress)} />
        ))}
      </Animated.View>
    ),
    [animatedOptionsStyle, onItemPress, options],
  );

  if (!selectedItem) {
    return null;
  }

  return (
    <Animated.View style={[StyleSheet.absoluteFill, overlayStyle]}>
      {Platform.OS === 'ios' ? (
        <BlurView blurType="ultraThinMaterialDark" reducedTransparencyFallbackColor={colors.background} style={[StyleSheet.absoluteFill]} />
      ) : (
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.blurBackgroundAndroid }]} />
      )}
      <Touchable onPress={handlePressOut} style={styles.container}>
        <Animated.View style={animatedStyle}>
          <Animated.View style={styles.itemContainer}>
            <Touchable style={[styles.item, itemStyles, { backgroundColor: colors.dark50 }]}>
              <View pointerEvents="none">{selectedItem}</View>
            </Touchable>
          </Animated.View>
          {renderOptions()}
        </Animated.View>
      </Touchable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
  },
  item: {
    borderRadius: 16,
    padding: 12,
    margin: -12,
  },
  options: {
    marginTop: 18,
    width: '80%',
    marginLeft: 14,
    borderRadius: 16,
    overflow: 'hidden',
    transformOrigin: 'left top',
  },
});
