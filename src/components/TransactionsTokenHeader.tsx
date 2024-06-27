import React from 'react';

import { StyleSheet, View } from 'react-native';

import { AnimatedNumbers } from '@/components/AnimatedNumbers';
import { Label } from '@/components/Label';
import { useTokenBalanceConvertedToAppCurrency } from '@/hooks/useAppCurrencyValue';
import { useAppCurrency } from '@/realm/settings';
import { RealmToken } from '@/realm/tokens';
import { getAvailableTokenBalance } from '@/realm/tokens/getAvailableTokenBalance';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { isBtc } from '@/utils/isBtc';
import { unitConverter } from '@/utils/unitConverter';

import loc from '/loc';

interface Props {
  testID?: string;
  token: RealmToken;
}

export const TransactionsTokenHeader = ({ token, testID }: Props) => {
  const { currency, currencyInfo } = useAppCurrency();
  const fiatValue = useTokenBalanceConvertedToAppCurrency(token);
  const tokenBalance = getAvailableTokenBalance(token);
  const tokenAmount = unitConverter.smallUnit2TokenUnit(tokenBalance, token.metadata.decimals).toString(10);
  const tokenAmountFormatted = formatTokenAmount(tokenAmount, { compact: true, currency, highPrecision: true, isBtc: isBtc({ assetId: token.assetId }) });

  return (
    <View testID={testID} style={styles.container}>
      <Label type="boldCaption2" color="light50" style={styles.label}>
        {loc.transactionTile.balance.toUpperCase()}
      </Label>
      {!!fiatValue && (
        <AnimatedNumbers
          type="headerBalance"
          value={formatCurrency(fiatValue, { currency, hideCurrencySign: true })}
          ticker={currencyInfo.symbol}
          tickerFontSize={16}
          tickerBottomOffset={4}
          fontSize={36}
          height={42}
          glyphSize={28}
          color="lavenderIndigo"
          testID={`FiatBalance-${testID}`}
        />
      )}
      <AnimatedNumbers
        type="headerBalance"
        value={tokenAmountFormatted}
        ticker={token.metadata.symbol}
        tickerFontSize={24}
        testID={`AssetBalance-${testID}`}
        fontSize={56}
        glyphSize={42}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 36,
  },
  label: {
    marginBottom: 4,
  },
});
