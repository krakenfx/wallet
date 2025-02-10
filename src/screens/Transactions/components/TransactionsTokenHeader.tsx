import { StyleSheet } from 'react-native';

import { BalanceHeader } from '@/components/BalanceHeader';
import { Label } from '@/components/Label';
import { useTokenBalanceConvertedToAppCurrency } from '@/hooks/useAppCurrencyValue';
import { useAppCurrency } from '@/realm/settings';
import type { RealmToken } from '@/realm/tokens';
import { getAvailableTokenBalance } from '@/realm/tokens/getAvailableTokenBalance';
import { unitConverter } from '@/utils/unitConverter';

import loc from '/loc';

interface Props {
  testID: string;
  token: RealmToken;
}

const styles = StyleSheet.create({
  header: {
    textTransform: 'uppercase',
  },
});

const Header = (
  <Label type="boldCaption2" color="light50" style={styles.header}>
    {loc.transactionTile.balance}
  </Label>
);

export const TransactionsTokenHeader = ({ token, testID }: Props) => {
  const { currency, currencyInfo } = useAppCurrency();
  const fiatValue = useTokenBalanceConvertedToAppCurrency(token);
  const tokenBalance = getAvailableTokenBalance(token);
  const tokenAmount = unitConverter.smallUnit2TokenUnit(tokenBalance, token.metadata.decimals).toString(10);

  return (
    <BalanceHeader
      currency={currency}
      currencyInfo={currencyInfo}
      fiatValue={fiatValue}
      header={Header}
      testIDs={[testID, `FiatBalance-${testID}`, `AssetBalance-${testID}`]}
      tokenAmount={tokenAmount}
      tokenSymbol={token.metadata.symbol}
      tokenId={token.assetId}
    />
  );
};
