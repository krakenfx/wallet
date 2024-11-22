import { StyleSheet, View } from 'react-native';

import { AnimatedNumbers } from '@/components/AnimatedNumbers';
import { Label } from '@/components/Label';
import { useTokenBalanceConvertedToAppCurrency } from '@/hooks/useAppCurrencyValue';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useDeviceSize } from '@/hooks/useDeviceSize';
import { useAppCurrency, useIsHideBalancesEnabled } from '@/realm/settings';
import type { RealmToken } from '@/realm/tokens';
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
  const balancesHidden = useIsHideBalancesEnabled();
  const tokenBalance = getAvailableTokenBalance(token);
  const tokenAmount = unitConverter.smallUnit2TokenUnit(tokenBalance, token.metadata.decimals).toString(10);
  const tokenAmountFormatted = useBalanceDisplay(
    formatTokenAmount(tokenAmount, { compact: true, currency, highPrecision: true, isBtc: isBtc({ assetId: token.assetId }) }),
    7,
  );
  const formattedFiat = useBalanceDisplay(formatCurrency(fiatValue, { currency, hideCurrencySign: true }), 7);
  const { size } = useDeviceSize();

  return (
    <View testID={testID} style={[styles.container, size === 'small' && styles.smallDeviceContainer]}>
      <Label type="boldCaption2" color="light50" style={styles.label}>
        {loc.transactionTile.balance.toUpperCase()}
      </Label>
      <AnimatedNumbers
        type="headerBalance"
        value={formattedFiat}
        ticker={!balancesHidden ? currencyInfo.symbol : ''}
        tickerFontSize={16}
        tickerBottomOffset={4}
        fontSize={36}
        height={42}
        glyphSize={28}
        color="lavenderIndigo"
        testID={`FiatBalance-${testID}`}
      />
      <AnimatedNumbers
        type="headerBalance"
        value={tokenAmountFormatted}
        ticker={!balancesHidden ? token.metadata.symbol : ''}
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
  smallDeviceContainer: {
    marginTop: 16,
  },
  label: {
    marginBottom: 4,
  },
});
