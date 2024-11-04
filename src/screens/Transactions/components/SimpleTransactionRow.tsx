import React, { useCallback } from 'react';

import { useAssetMetadata } from '@/realm/assetMetadata';
import { TRANSACTION_TYPES } from '@/realm/transactions/const';
import type { SimpleTransactionData } from '@/realm/transactions/getTransactionMetadata';
import { Routes } from '@/Routes';

import { TRANSACTIONS_REALM_QUEUE_KEY } from '../utils/types';
import { useSimpleTransactionDetailsDisplayData } from '../utils/useTransactionDetailsDisplayData/useSimpleTransactionDetailsDisplayData';
import { useSimpleTransactionDisplayData } from '../utils/useTransactionDisplayData/useSimpleTransactionDisplayData';

import { TransactionDataRow } from './TransactionDataRow';

import type { TransactionRowCommonProps } from './types';

export interface SimpleTransactionRowProps extends TransactionRowCommonProps {
  classifiedTx: SimpleTransactionData;
}

export const SimpleTransactionRow = React.memo(
  ({ item, classifiedTx, parsedTx, contextToken, navigation, testID, containerStyle }: SimpleTransactionRowProps) => {
    const txMetadata = useAssetMetadata({
      assetId: classifiedTx.effect.assetId,
      realmQueueName: TRANSACTIONS_REALM_QUEUE_KEY,
    });
    const displayData = useSimpleTransactionDisplayData({
      item,
      classifiedTx,
      parsedTx,
      contextToken,
      txMetadata,
      testID,
    });

    const { assetAmount, appCurrencyValue, description, detailsAssetAmount, detailsAssetAmountInCurrency, title } = displayData;

    const transactionDetailsDisplayData = useSimpleTransactionDetailsDisplayData({
      
      assetAmount: detailsAssetAmount === undefined ? assetAmount : detailsAssetAmount,
      appCurrencyValue: detailsAssetAmountInCurrency === undefined ? appCurrencyValue : detailsAssetAmountInCurrency,
      classifiedTx,
      description,
      symbol: txMetadata?.symbol,
      item,
      title,
    });

    const openTransactionDetails = useCallback(() => {
      navigation.navigate(Routes.TransactionDetails, {
        assetId: contextToken?.assetId,
        id: item.id,
        transactionDetailsData: transactionDetailsDisplayData,
      });
    }, [contextToken?.assetId, item.id, navigation, transactionDetailsDisplayData]);

    
    const isTokenApproval = classifiedTx.type === TRANSACTION_TYPES.TOKEN_APPROVAL || classifiedTx.type === TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED;

    return (
      <TransactionDataRow
        {...displayData}
        testID={testID}
        item={item}
        onPress={openTransactionDetails}
        shouldShowAmounts={!isTokenApproval}
        containerStyle={containerStyle}
      />
    );
  },
);
