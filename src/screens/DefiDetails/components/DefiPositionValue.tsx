import type { FC } from 'react';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FadeIn } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { formatCurrency } from '@/utils/formatCurrency';

import { useColorByCategory } from '../utils';

interface Props {
  value: number;
  category: string;
}

export const DefiPositionValue: FC<Props> = ({ value, category }) => {
  const { color, isDebt } = useColorByCategory(category, value);

  const { currency } = useAppCurrency();

  const textColor = isDebt ? 'yellow500' : color;
  const presentedValue = isDebt ? Math.abs(value) : value;

  return (
    <View style={styles.amountFiatText}>
      <Label color={textColor} entering={FadeIn} style={styles.numbers} type="boldLargeMonospace">
        {formatCurrency(presentedValue, { currency })}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  amountFiatText: {
    alignItems: 'flex-end',
    marginTop: 5,
  },
  numbers: {
    justifyContent: 'flex-end',
    textAlign: 'right',
    marginBottom: 4,
  },
});
