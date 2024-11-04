import React from 'react';
import { StyleSheet } from 'react-native';
import { FadeIn } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { useTokenBalanceConvertedToAppCurrency } from '@/hooks/useAppCurrencyValue';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useIsHideBalancesEnabled } from '@/realm/settings';
import type { Currency } from '@/screens/Settings/currency';
import { formatCurrency } from '@/utils/formatCurrency';

import type { AssetRowProps } from './AssetRow';

export const AssetRowAmountInFiat = ({ currency, token, options }: Pick<AssetRowProps, 'token' | 'options'> & { currency: Currency }) => {
  const amountInAppCurrency = useTokenBalanceConvertedToAppCurrency(token) ?? 0;
  const balancesHidden = useIsHideBalancesEnabled();
  const amountFormatted = useBalanceDisplay(formatCurrency(amountInAppCurrency, { currency }), 7);
  return !options?.hideZeroAmountFiat || amountInAppCurrency > 0 ? (
    <Label
      entering={FadeIn}
      style={[styles.animatedNumbers, balancesHidden && styles.balanceHidden]}
      type="boldLargeMonospace"
      color={balancesHidden ? 'light50' : 'light100'}>
      {amountFormatted}
    </Label>
  ) : null;
};

const styles = StyleSheet.create({
  animatedNumbers: {
    alignItems: 'flex-end',
    textAlign: 'right',
    minWidth: 100,
  },
  balanceHidden: { paddingTop: 5, marginBottom: -5 },
});
