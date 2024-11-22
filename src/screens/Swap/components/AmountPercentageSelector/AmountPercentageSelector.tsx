import type React from 'react';

import { useCallback } from 'react';

import { Keyboard, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { FloatingBottomContainer } from '@/components/FloatingBottomContainer';

import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import { useAppCurrency } from '@/realm/settings';
import type { RealmToken } from '@/realm/tokens';
import { useTheme } from '@/theme/themes';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { isBtc } from '@/utils/isBtc';

import { SuperBigNumber } from '@/utils/SuperBigNumber';
import { unitConverter } from '@/utils/unitConverter';

import { useSwapContext } from '../SwapContext';

const PERCENTAGE_OPTS = [0.25, 0.5, 0.75, 1] as const;
const PERCENTAGE_OPTS_VALUES = PERCENTAGE_OPTS.map(o => ({ value: o, label: `${o * 100}%` }));

type PercentageOption = (typeof PERCENTAGE_OPTS)[number];

export const AmountPercentageSelector: React.FC<{ token: RealmToken }> = ({ token }) => {
  const { colors } = useTheme();
  const { currency } = useAppCurrency();

  const {
    sourceAmountState: [_, setSourceAmount],
    sourceAmountInputValueState: [__, setSourceAmountString],
    amountInputFocusState: [isAmountInputFocused],
  } = useSwapContext();

  const onSelect = useCallback(
    (o: PercentageOption) => {
      Keyboard.dismiss();
      const balanceCut = new SuperBigNumber(token.balance).multipliedBy(o).toFixed(0);
      const balanceCutInTokenUnit = unitConverter.smallUnit2TokenUnit(balanceCut, token.metadata.decimals);
      const amountFormatted = formatTokenAmount(balanceCutInTokenUnit.toString(10), {
        compact: true,
        currency,
        highPrecision: true,
        isBtc: isBtc({ assetId: token.assetId }),
      });
      setSourceAmountString(amountFormatted);
      setSourceAmount(balanceCut);
    },
    [currency, setSourceAmount, setSourceAmountString, token.assetId, token.balance, token.metadata.decimals],
  );

  return (
    <FloatingBottomContainer avoidKeyboard bottomSpace={8}>
      {isAmountInputFocused && (
        <Animated.View entering={FadeIn.delay(100)} style={styles.container}>
          {PERCENTAGE_OPTS_VALUES.map(({ label, value }) => (
            <Touchable key={label} onPress={() => onSelect(value)} style={[styles.option, { backgroundColor: colors.purple_40 }]}>
              <Label color="light75">{label}</Label>
            </Touchable>
          ))}
        </Animated.View>
      )}
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
