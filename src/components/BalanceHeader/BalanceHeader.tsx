import type { ReactElement } from 'react';

import { StyleSheet, View } from 'react-native';

import { AnimatedNumbers } from '@/components/AnimatedNumbers';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useDeviceSize } from '@/hooks/useDeviceSize';
import { useIsHideBalancesEnabled } from '@/realm/settings';

import type { Currency, CurrencyInfo } from '@/screens/Settings/currency';

import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { isBtc } from '@/utils/isBtc';

interface Props {
  currency: Currency;
  currencyInfo: CurrencyInfo;
  fiatLast?: boolean;
  fiatValue?: number;
  footer?: ReactElement;
  header?: ReactElement;
  testIDs?: [string, string, string];
  tokenAmount: string;
  tokenSymbol: string;
  tokenId: string;
}

export const BalanceHeader = ({ currency, currencyInfo, fiatLast, fiatValue, footer, header, testIDs, tokenAmount, tokenSymbol, tokenId }: Props) => {
  const { size } = useDeviceSize();
  const balancesHidden = useIsHideBalancesEnabled();
  const tokenAmountFormatted = useBalanceDisplay(
    formatTokenAmount(tokenAmount, { compact: true, currency, highPrecision: true, isBtc: isBtc({ assetId: tokenId }) }),
    7,
  );
  const formattedFiat = useBalanceDisplay(formatCurrency(fiatValue, { currency, hideCurrencySign: true }), 7);
  const { first, last } = fiatLast
    ? { first: { value: tokenAmountFormatted, ticker: tokenSymbol }, last: { value: formattedFiat, ticker: currencyInfo.symbol } }
    : { first: { value: formattedFiat, ticker: currencyInfo.symbol }, last: { value: tokenAmountFormatted, ticker: tokenSymbol } };

  return (
    <View testID={testIDs?.[0]} style={[styles.container, size === 'small' && styles.smallDeviceContainer]}>
      {header && <View style={styles.header}>{header}</View>}
      <AnimatedNumbers
        color="lavenderIndigo"
        fontSize={36}
        glyphSize={28}
        height={42}
        testID={testIDs?.[1]}
        ticker={!balancesHidden ? first.ticker : ''}
        tickerBottomOffset={4}
        tickerFontSize={16}
        type="headerBalance"
        value={first.value}
      />
      <AnimatedNumbers
        fontSize={56}
        glyphSize={42}
        testID={testIDs?.[2]}
        ticker={!balancesHidden ? last.ticker : ''}
        tickerFontSize={24}
        type="headerBalance"
        value={last.value}
      />
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 36,
  },
  smallDeviceContainer: {
    marginTop: 16,
  },
  header: {
    marginBottom: 4,
  },
  footer: {
    marginTop: 16,
  },
});
