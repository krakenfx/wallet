import type React from 'react';

import { useCallback } from 'react';

import { Keyboard, StyleSheet } from 'react-native';
import Animated, { KeyboardState, useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';

import { FloatingBottomContainer } from '@/components/FloatingBottomContainer';

import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import type { RealmToken } from '@/realm/tokens';
import { useTheme } from '@/theme/themes';

import { SuperBigNumber } from '@/utils/SuperBigNumber';

import { useSwapContext } from '../SwapContext';

const PERCENTAGE_OPTS = [0.25, 0.5, 0.75, 1] as const;
const PERCENTAGE_OPTS_VALUES = PERCENTAGE_OPTS.map(o => ({ value: o, label: `${o * 100}%` }));

type PercentageOption = (typeof PERCENTAGE_OPTS)[number];

export const AmountPercentageSelector: React.FC<{ token: RealmToken }> = ({ token }) => {
  const { colors } = useTheme();

  const {
    amountInputFocusState: [isAmountInputFocused],
    updateAmount,
  } = useSwapContext();

  const onSelect = useCallback(
    (o: PercentageOption) => {
      Keyboard.dismiss();
      updateAmount(new SuperBigNumber(token.balance).multipliedBy(o).toFixed(0), 'smallestUnit');
    },
    [token.balance, updateAmount],
  );

  const keyboard = useAnimatedKeyboard({ isStatusBarTranslucentAndroid: true });

  const style = useAnimatedStyle(() => {
    if (!isAmountInputFocused) {
      return { opacity: 0 };
    }
    switch (keyboard.state.value) {
      case KeyboardState.OPEN:
      case KeyboardState.OPENING:
        return { opacity: 1 };
      default:
        return { opacity: 0 };
    }
  }, [keyboard, isAmountInputFocused]);

  return (
    <FloatingBottomContainer avoidKeyboard bottomSpace={8}>
      <Animated.View style={[styles.container, style]} pointerEvents={isAmountInputFocused ? 'auto' : 'none'}>
        {PERCENTAGE_OPTS_VALUES.map(({ label, value }) => (
          <Touchable key={label} onPress={() => onSelect(value)} style={[styles.option, { backgroundColor: colors.purple_40 }]}>
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
