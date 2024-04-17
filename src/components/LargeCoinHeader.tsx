import React from 'react';
import { StyleSheet } from 'react-native';

import { AnimatedNumbers } from '@/components/AnimatedNumbers';
import { useTokenBalanceConvertedToAppCurrency } from '@/hooks/useAppCurrencyValue';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { RealmToken } from '@/realm/tokens';
import { RealmWallet } from '@/realm/wallets';

import { getLabelName } from '../utils/getLabelName';

import { LargeHeader } from './LargeHeader';

import { prettifyFiatValue, tokenAmountShortened } from '/modules/text-utils';

interface LargeCoinHeaderProps {
  pill?: JSX.Element;
  testID?: string;
  token: RealmToken;
  wallet: RealmWallet;
}

export const LargeCoinHeader = ({ token, wallet, testID, pill }: LargeCoinHeaderProps) => {
  const fiatValue = useTokenBalanceConvertedToAppCurrency(token);
  const amountToDisplay = tokenAmountShortened(token);
  const { currencyInfo } = useAppCurrency();

  const titleName = getLabelName(token, wallet);

  return (
    <LargeHeader testID={testID} title={titleName}>
      <AnimatedNumbers
        type="headerBalance"
        value={amountToDisplay}
        ticker={token.metadata.symbol}
        tickerFontSize={24}
        testID={`AssetBalance-${testID}`}
        fontSize={56}
        glyphSize={42}
      />
      {!!fiatValue && (
        <AnimatedNumbers
          type="headerBalance"
          value={prettifyFiatValue(fiatValue)}
          ticker={currencyInfo.symbol}
          tickerFontSize={16}
          tickerBottomOffset={2}
          fontSize={28}
          height={36}
          glyphSize={20}
          style={styles.fiatValue}
          testID={`FiatBalance-${testID}`}
        />
      )}
      {pill}
    </LargeHeader>
  );
};

const styles = StyleSheet.create({
  fiatValue: {
    marginTop: 2,
  },
});
