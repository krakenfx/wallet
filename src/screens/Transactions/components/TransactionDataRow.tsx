import type { StyleProp, ViewStyle } from 'react-native';

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { KrakenIcon } from '@/components/KrakenIcon';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { TransactionRow } from '@/components/TransactionRow';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useIsHideBalancesEnabled } from '@/realm/settings/useIsHideBalancesEnabled';
import { type RealmTransaction, TRANSACTION_STATUS_KRAKEN_CONNECT, type TransactionStatus } from '@/realm/transactions';
import { usePendingTransactionById } from '@/realm/transactions';
import { formatTokenAmount } from '@/utils/formatTokenAmount';

import loc from '/loc';

const Amounts = ({
  assetAmount,
  assetSymbol,
  amountInCurrency,
  testID,
}: {
  assetAmount: string;
  assetSymbol: string;
  amountInCurrency: string;
  testID?: string;
}) => {
  const { currency } = useAppCurrency();
  const assetAmountFormatted = formatTokenAmount(assetAmount, {
    compact: true,
    currency,
    highPrecision: true,
    isBtc: assetSymbol === 'BTC',
  });
  const balancesHidden = useIsHideBalancesEnabled();
  const currencyDisplay = useBalanceDisplay(amountInCurrency, 7);
  const balanceDisplay = useBalanceDisplay(`${assetAmountFormatted} ${assetSymbol}`);

  return (
    <>
      <Label
        style={styles.amountsText}
        type="boldLargeMonospace"
        numberOfLines={1}
        testID={testID && `Usd-${testID}`}
        color={balancesHidden ? 'light50' : 'light100'}>
        {currencyDisplay}
      </Label>
      <Label style={styles.amountsText} type="regularMonospace" color="light50" numberOfLines={1} testID={testID && `Amount-${testID}`}>
        {balanceDisplay}
      </Label>
    </>
  );
};

export type TransactionDataRowProps = {
  onPress: () => void;
  icon?: React.ReactElement;
  shouldShowAmounts: boolean;
  assetAmountAndNetworkFee?: string;
  assetAmountAndNetworkFeeInCurrencyFormatted?: string;
  assetSymbol?: string;
  appCurrencyValue: string;
  assetAmount: string;
  descriptionIcon?: React.ReactElement;
  description: string;
  title: string;
  item: RealmTransaction;
  isNetworkFee: boolean;
  testID?: string;
  containerStyle?: StyleProp<ViewStyle>;
  status?: TransactionStatus['status'];
};

export const TransactionDataRow = React.memo(
  ({
    title,
    onPress,
    item,
    isNetworkFee,
    icon,
    appCurrencyValue,
    shouldShowAmounts,
    assetAmountAndNetworkFee,
    descriptionIcon,
    description,
    assetAmountAndNetworkFeeInCurrencyFormatted,
    testID,
    assetSymbol,
    assetAmount,
    containerStyle,
    status,
  }: TransactionDataRowProps) => {
    const pendingTx = usePendingTransactionById(item.id);

    const showRow = !(pendingTx !== undefined && pendingTx.isValid() && !pendingTx.confirmed);

    const shouldShowAssetAmountAndNetworkFees = Boolean(assetAmountAndNetworkFee && assetAmountAndNetworkFeeInCurrencyFormatted);
    const isTransactionFailed = status === 'failed';
    const isTransactionFromKrakenConnect = item.additionalStatus === TRANSACTION_STATUS_KRAKEN_CONNECT;

    const title_ = useMemo(
      () => (
        <Label type="boldBody">
          {isNetworkFee ? loc.transactionTile.networkFee : isTransactionFromKrakenConnect ? loc.transactionDetails.krakenConnect.transferredIn : title}
        </Label>
      ),
      [isNetworkFee, isTransactionFromKrakenConnect, title],
    );
    const subtitle = useMemo(
      () => (
        <View style={styles.description}>
          {isTransactionFailed && <SvgIcon name="x-circle" color="red400" size={16} style={styles.space} />}
          {isTransactionFromKrakenConnect && (
            <View style={styles.space}>
              <KrakenIcon size={16} iconSize={12} />
            </View>
          )}
          <View style={styles.description}>
            {isTransactionFailed && (
              <Label type="boldCaption1" color="red400" numberOfLines={1}>
                {loc.transactionDetails.state.failed + ' '}
              </Label>
            )}
            {descriptionIcon && <View style={styles.descriptionIcon}>{descriptionIcon}</View>}
            <Label type="regularCaption1" color="light50" style={styles.subtitle} testID={`Description-${testID}`}>
              {isTransactionFromKrakenConnect ? loc.transactionDetails.krakenConnect.fromKraken : description}
            </Label>
          </View>
        </View>
      ),
      [description, descriptionIcon, isTransactionFailed, isTransactionFromKrakenConnect, testID],
    );
    const amounts = useMemo(
      () => (
        <>
          {shouldShowAmounts && shouldShowAssetAmountAndNetworkFees && assetSymbol && (
            <Amounts
              assetAmount={assetAmountAndNetworkFee!}
              assetSymbol={assetSymbol}
              amountInCurrency={assetAmountAndNetworkFeeInCurrencyFormatted!}
              testID={testID}
            />
          )}
          {shouldShowAmounts && !shouldShowAssetAmountAndNetworkFees && assetAmount && assetSymbol && (
            <Amounts assetAmount={assetAmount} assetSymbol={assetSymbol} amountInCurrency={appCurrencyValue} testID={testID} />
          )}
        </>
      ),
      [
        appCurrencyValue,
        assetAmountAndNetworkFee,
        shouldShowAmounts,
        shouldShowAssetAmountAndNetworkFees,
        assetAmountAndNetworkFeeInCurrencyFormatted,
        assetAmount,
        assetSymbol,
        testID,
      ],
    );

    return (
      <View>
        {showRow && (
          <Touchable onPress={onPress}>
            <TransactionRow containerStyle={containerStyle} icon={icon} title={title_} subtitle={subtitle} amounts={amounts} testID={testID} />
          </Touchable>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  amountsText: {
    textAlign: 'right',
    width: '100%',
    flexShrink: 1,
    overflow: 'hidden',
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionIcon: {
    paddingRight: 4,
  },
  space: {
    marginRight: 4,
  },
  subtitle: {
    alignSelf: 'flex-start',
  },
});
