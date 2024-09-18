import React, { useCallback } from 'react';

import { ContractInteractionData } from '@/realm/transactions/getTransactionMetadata';
import { Routes } from '@/Routes';

import { useContractInteractionDetailsDisplayData } from '../utils/useTransactionDetailsDisplayData';
import { useContractInteractionDisplayData } from '../utils/useTransactionDisplayData';

import { TransactionDataRow } from './TransactionDataRow';
import { TransactionRowCommonProps } from './types';

export interface ContractInteractionRowProps extends TransactionRowCommonProps {
  classifiedTx: ContractInteractionData;
}

export const ContractInteractionRow = React.memo(
  ({ item, parsedTx, classifiedTx, contextToken, navigation, testID, containerStyle }: ContractInteractionRowProps) => {
    const displayData = useContractInteractionDisplayData({
      item,
      parsedTx,
      classifiedTx,
      contextToken,
      testID,
    });

    const { assetAmount, appCurrencyValue, description, detailsAssetAmount, detailsAssetAmountInCurrency, title } = displayData;

    const transactionDetailsDisplayData = useContractInteractionDetailsDisplayData({
      
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
  },
);
