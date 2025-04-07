import { Keyboard, StyleSheet } from 'react-native';
import Animated, { KeyboardState, useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';

import { FloatingBottomContainer } from '@/components/FloatingBottomContainer';

import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

const PERCENTAGE_OPTS = [0.25, 0.5, 0.75, 1] as const;
const PERCENTAGE_OPTS_VALUES = PERCENTAGE_OPTS.map(o => ({ value: o, label: `${o * 100}%` }));

export type PercentageOption = (typeof PERCENTAGE_OPTS)[number];

interface Props {
  onSelect: (o: PercentageOption) => void;
  isInputFocused: boolean | undefined;
}

export const AmountPercentageSelector = ({ isInputFocused, onSelect }: Props) => {
  const { colors } = useTheme();
  const keyboard = useAnimatedKeyboard({ isStatusBarTranslucentAndroid: true });

  const style = useAnimatedStyle(() => {
    switch (keyboard.state.value) {
      case KeyboardState.OPEN:
      case KeyboardState.OPENING:
        return { opacity: 1, height: 'auto' };
      default:
        return { opacity: 0 };
    }
  }, [keyboard]);

  const handleSelect = (o: PercentageOption) => {
    Keyboard.dismiss();
    onSelect(o);
  };

  return (
    <FloatingBottomContainer avoidKeyboard bottomSpace={8}>
      <Animated.View style={[styles.container, style]} pointerEvents={isInputFocused ? 'auto' : 'none'}>
        {PERCENTAGE_OPTS_VALUES.map(({ label, value }) => (
          <Touchable key={label} onPress={() => handleSelect(value)} style={[styles.option, { backgroundColor: colors.purple_40 }]}>
            <Label color="light75">{label}</Label>
          </Touchable>
        ))}
      </Animated.View>
    </FloatingBottomContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
  },
  option: {
    height: 34,
    minWidth: 78,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
