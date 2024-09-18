import React, { useCallback } from 'react';

import { SwapTransactionData } from '@/realm/transactions/getTransactionMetadata';
import { Routes } from '@/Routes';

import { useSwapTransactionDetailsDisplayData } from '../utils/useTransactionDetailsDisplayData';
import { useSwapTransactionDisplayData } from '../utils/useTransactionDisplayData';

import { TransactionDataRow } from './TransactionDataRow';
import { TransactionRowCommonProps } from './types';

export interface SwapTransactionRowProps extends TransactionRowCommonProps {
  classifiedTx: SwapTransactionData;
}

export const SwapTransactionRow = React.memo(({ item, classifiedTx, parsedTx, contextToken, navigation, testID, containerStyle }: SwapTransactionRowProps) => {
  const displayData = useSwapTransactionDisplayData({
    item,
    classifiedTx,
    parsedTx,
    contextToken,
    testID,
  });

  const { detailsAssetAmount, assetAmount, detailsAssetAmountInCurrency, appCurrencyValue, description, title } = displayData;

  const transactionDetailsDisplayData = useSwapTransactionDetailsDisplayData({
    
    assetAmount: detailsAssetAmount === undefined ? assetAmount : detailsAssetAmount,
    appCurrencyValue: detailsAssetAmountInCurrency === undefined ? appCurrencyValue : detailsAssetAmountInCurrency,
    classifiedTx,
    description,
    item,
    title,
  });

  const openTransactionDetails = useCallback(() => {
    navigation.navigate(Routes.TransactionDetails, {
      assetId: contextToken?.assetId,
      id: item.id,
      transactionDetailsData: transactionDetailsDisplayData,
    });
  }, [item, navigation, contextToken?.assetId, transactionDetailsDisplayData]);

  return <TransactionDataRow {...displayData} item={item} onPress={openTransactionDetails} shouldShowAmounts containerStyle={containerStyle} />;
});
