import { StyleSheet } from 'react-native';
import Animated, { CurvedTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import type { IconName } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

interface Props {
  onPress: () => void;
  iconName: IconName;
  label: string;
  testID: string;
  disableEffect?: boolean;
}

const ANIMATION_TIME = 800;
export const ActionButton = ({ onPress, iconName, label, disableEffect, testID }: Props) => {
  const activatedAnimation = useSharedValue(false);
  const { colors } = useTheme();

  const handleOnPress = () => {
    if (!disableEffect) {
      activatedAnimation.value = true;
      setTimeout(() => (activatedAnimation.value = false), ANIMATION_TIME);
    }
    onPress();
  };

  const actionBtnStyle = useAnimatedStyle(
    () => ({
      backgroundColor: withTiming(activatedAnimation.value ? colors.green500 : 'transparent'),
    }),
    [colors.green500],
  );
  return (
    <Touchable layout={CurvedTransition} onPress={handleOnPress}>
      <Animated.View style={[styles.buttonRow, actionBtnStyle]} testID={`State${label}-${testID}`}>
        <SvgIcon style={styles.buttonRowIcon} name={iconName} />
        <Label testID={testID}>{label}</Label>
      </Animated.View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  buttonRowIcon: {
    marginRight: 8,
  },
});
