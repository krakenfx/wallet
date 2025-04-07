import { Image, StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { TokenIcon, omitNetworkIcons } from '@/components/TokenIcon';
import { TransactionRow } from '@/components/TransactionRow';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import type { WalletType } from '@/onChain/wallets/registry';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useIsHideBalancesEnabled } from '@/realm/settings/useIsHideBalancesEnabled';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { smallUnit2TokenUnit } from '@/utils/unitConverter';

import loc from '/loc';

export type DefiDetailsTransactionRowProps = {
  assetAmount: string;
  assetAmountInUsd: number;
  assetDecimals?: number;
  assetId: string;
  assetNetwork: WalletType;
  assetSymbol: string;
  protocolLogo: string;
  protocolName: string;
  title: string;
  testID?: string;
};

const titleLocalized: Record<string, () => string> = {
  Deposit: () => loc.earn.detailsSheet.deposit,
  Transfer: () => loc.earn.detailsSheet.transfer,
  Withdrawal: () => loc.earn.detailsSheet.withdraw,
};

const subtitleLocalized: Record<string, () => string> = {
  Deposit: () => loc.earn.detailsSheet.to,
  Transfer: () => loc.earn.detailsSheet.to,
  Withdrawal: () => loc.earn.detailsSheet.from,
};

export const DefiDetailsTransactionRow = ({
  title,
  assetId,
  assetAmountInUsd,
  assetDecimals,
  assetNetwork,
  protocolLogo,
  protocolName,
  testID,
  assetSymbol,
  assetAmount,
}: DefiDetailsTransactionRowProps) => {
  const title_ = titleLocalized[title]?.() ?? '-';
  const subtitle = subtitleLocalized[title]?.() ?? loc.earn.detailsSheet.to;
  const assetSymbol_ = assetSymbol === '-' ? '' : assetSymbol;

  return (
    <TransactionRow
      icon={
        <TokenIcon tokenId={assetId} tokenSymbol={assetSymbol_} networkName={assetNetwork} forceOmitNetworkIcon={omitNetworkIcons[assetId] === assetNetwork} />
      }
      title={
        <Label type="boldBody" numberOfLines={1} adjustsFontSizeToFit>
          {title_}
        </Label>
      }
      subtitle={
        <View style={styles.subtitleContainer}>
          <Label type="regularCaption1" color="light50" style={styles.subtitle} testID={`Description-${testID}`}>
            {subtitle}
          </Label>
          <Image style={styles.protocolLogo} source={{ uri: protocolLogo }} />
          <Label type="regularCaption1" color="light50" style={styles.subtitle} numberOfLines={1} adjustsFontSizeToFit>
            {protocolName}
          </Label>
        </View>
      }
      amounts={
        <Amounts assetAmount={assetAmount} assetDecimals={assetDecimals} assetSymbol={assetSymbol} assetAmountInUsd={assetAmountInUsd} testID={testID} />
      }
      testID={testID}
    />
  );
};

const Amounts = ({
  assetAmount,
  assetDecimals,
  assetSymbol,
  assetAmountInUsd,
  testID,
}: {
  assetAmount: string;
  assetDecimals?: number;
  assetSymbol: string;
  assetAmountInUsd: number;
  testID?: string;
}) => {
  const { currency } = useAppCurrency();
  const fiatRate = useCurrentUsdFiatRate();
  const assetAmountInTokenUnit = smallUnit2TokenUnit(assetAmount, assetDecimals ?? 18);
  const assetAmountFormatted = formatTokenAmount(assetAmountInTokenUnit.toString(), {
    compact: true,
    currency,
    highPrecision: true,
    isBtc: assetSymbol === 'BTC',
  });
  const assetAmountFiatFormatted = formatCurrency(String(fiatRate * assetAmountInUsd), { currency });
  const balancesHidden = useIsHideBalancesEnabled();
  const currencyDisplay = useBalanceDisplay(assetAmountFiatFormatted, 7);
  const balanceDisplay = useBalanceDisplay(`${assetDecimals ? assetAmountFormatted : '-'} ${assetSymbol}`);
  const color = balancesHidden ? 'light50' : 'light100';
  const fiatTestId = testID && `Fiat-${testID}`;
  const amountTestId = testID && `Amount-${testID}`;

  return (
    <>
      <Label style={styles.amountsText} type="boldLargeMonospace" numberOfLines={1} testID={fiatTestId} color={color}>
        {currencyDisplay}
      </Label>
      <Label style={styles.amountsText} type="regularMonospace" color="light50" numberOfLines={1} testID={amountTestId}>
        {balanceDisplay}
      </Label>
    </>
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
  protocolLogo: {
    height: 16,
    width: 16,
    borderRadius: 5,
  },
});
