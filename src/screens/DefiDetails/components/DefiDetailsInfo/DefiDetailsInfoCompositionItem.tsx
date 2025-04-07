import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { TokenIcon } from '@/components/TokenIcon';
import { TransactionRow } from '@/components/TransactionRow';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatPercentage } from '@/utils/formatPercentage';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { isBtc } from '@/utils/isBtc';
import { smallUnit2TokenUnit } from '@/utils/unitConverter';

const HIDDEN_BALANCE_COUNT = 7;

type ItemProps = {
  tokenDecimals: number;
  tokenSymbol: string;
  tokenId: string;
  balanceNative: string;
  balanceUsd: number;
  ratio: number;
};

export const DefiDetailsInfoCompositionItem: React.FC<ItemProps> = ({ tokenDecimals, tokenSymbol, tokenId, balanceNative, balanceUsd, ratio }) => {
  const { currency } = useAppCurrency();
  const percentage = ratio * 100;
  const ratioFormatted = useBalanceDisplay(formatPercentage(percentage), HIDDEN_BALANCE_COUNT);
  const balanceNativeInTokenUnit = smallUnit2TokenUnit(balanceNative, tokenDecimals);
  const balanceNativeFormatted =
    useBalanceDisplay(
      formatTokenAmount(balanceNativeInTokenUnit.toString(10), { compact: true, currency, highPrecision: true, isBtc: isBtc({ assetId: tokenId }) }),
      HIDDEN_BALANCE_COUNT,
    ) +
    ' ' +
    tokenSymbol;
  const usdFiatRate = useCurrentUsdFiatRate();
  const balanceInAppCurrency = usdFiatRate * balanceUsd;
  const balanceUsdFormatted = useBalanceDisplay(
    formatCurrency(balanceInAppCurrency, {
      currency,
    }),
    HIDDEN_BALANCE_COUNT,
  );

  return (
    <TransactionRow
      icon={<TokenIcon tokenId={tokenId} tokenSymbol={tokenSymbol} forceOmitNetworkIcon />}
      title={
        <Label type="boldBody" numberOfLines={1} adjustsFontSizeToFit style={styles.tokenSymbol}>
          {tokenSymbol}
        </Label>
      }
      subtitle={
        <View style={styles.subtitleContainer}>
          <Label type="regularCaption1" color="light50" style={styles.subtitle}>
            {ratioFormatted}
          </Label>
        </View>
      }
      amounts={
        <>
          <Label style={styles.amountsText} type="boldLargeMonospace" numberOfLines={1}>
            {balanceUsdFormatted}
          </Label>
          <Label style={styles.amountsText} type="regularMonospace" color="light50" numberOfLines={1}>
            {balanceNativeFormatted}
          </Label>
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  amountsText: {
    textAlign: 'right',
    width: '100%',
    flexShrink: 1,
    overflow: 'hidden',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subtitle: {
    alignSelf: 'flex-start',
    textTransform: 'capitalize',
  },
  tokenSymbol: {
    textTransform: 'uppercase',
  },
});
