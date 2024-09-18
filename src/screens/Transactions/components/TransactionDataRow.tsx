import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useIsHideBalancesEnabled } from '@/realm/settings/useIsHideBalancesEnabled';
import { RealmTransaction, TransactionStatus, usePendingTransactionById } from '@/realm/transactions';
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

    return (
      <View>
        {showRow && (
          <Touchable onPress={onPress}>
            <View style={[styles.container, containerStyle]} testID={testID}>
              <View style={styles.startContainer}>
                {icon}

                <View style={styles.column} testID={`Title-${testID}`}>
                  <Label type="boldBody">{isNetworkFee ? loc.transactionTile.networkFee : title}</Label>

                  <View style={styles.description}>
                    {isTransactionFailed && <SvgIcon name="x-circle" color="red400" size={16} style={styles.space} />}
                    <View style={styles.description}>
                      {isTransactionFailed && (
                        <Label type="boldCaption1" color="red400" numberOfLines={1}>
                          {loc.transactionDetails.state.failed + ' '}
                        </Label>
                      )}
                      {descriptionIcon && <View style={styles.descriptionIcon}>{descriptionIcon}</View>}

                      <Label type="regularCaption1" color="light50" style={styles.subtitle} testID={`Description-${testID}`}>
                        {description}
                      </Label>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.spacer} />
              {shouldShowAmounts && (
                <View style={styles.endContainer}>
                  {shouldShowAssetAmountAndNetworkFees && assetSymbol && (
                    <Amounts
                      assetAmount={assetAmountAndNetworkFee!}
                      assetSymbol={assetSymbol}
                      amountInCurrency={assetAmountAndNetworkFeeInCurrencyFormatted!}
                      testID={testID}
                    />
                  )}
                  {!shouldShowAssetAmountAndNetworkFees && assetAmount && assetSymbol && (
                    <Amounts assetAmount={assetAmount} assetSymbol={assetSymbol} amountInCurrency={appCurrencyValue} testID={testID} />
                  )}
                </View>
              )}
            </View>
          </Touchable>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    height: 56,
  },
  startContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },
  endContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    maxWidth: '40%',
  },
  amountsText: {
    textAlign: 'right',
    width: '100%',
    flexShrink: 1,
    overflow: 'hidden',
  },
  column: {
    marginRight: 24,
  },
  spacer: {
    flex: 1,
  },
  verticalSpace: {
    marginVertical: 3,
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
