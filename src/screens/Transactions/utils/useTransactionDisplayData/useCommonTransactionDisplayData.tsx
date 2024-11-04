import { useMemo } from 'react';

import { useAppCurrencyValue } from '@/hooks/useAppCurrencyValue';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import type { TransactionData } from '@/realm/transactions/getTransactionMetadata';
import type { DisplayData } from '@/screens/Transactions/components/types';
import { TRANSACTIONS_REALM_QUEUE_KEY } from '@/screens/Transactions/utils/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { unitConverter } from '@/utils/unitConverter';

import { formatTransactionValueAsNegativeOrPositive } from '../formatTransactionValueAsNegativeOrPositive';

import type { getTransactionDisplayData } from './getTransactionDisplayData';

type Props = ReturnType<typeof getTransactionDisplayData>;
export const useCommonTransactionDisplayData = (props: Props, classifiedTx: TransactionData): DisplayData => {
  const { currency } = useAppCurrency();

  const {
    icon,
    isNetworkFee,
    isSwapSent,
    description,
    descriptionIcon,
    displayAssetMetadata,
    displayAssetId,
    displayAssetAmount,
    detailsAssetAmount,
    detailsAssetId,
    title,
    tokenAmountAndNetworkFee,
  } = props;

  
  const appCurrencyValue = useAppCurrencyValue(
    {
      metadata: { decimals: displayAssetMetadata?.decimals ?? 18 },
      assetId: displayAssetId ?? '',
    },
    displayAssetAmount ?? '',
    TRANSACTIONS_REALM_QUEUE_KEY,
  );

  const assetAppCurrencyValue = useMemo(() => {
    const formattedInAppCurrencyValue = formatCurrency(appCurrencyValue, { currency });

    return formatTransactionValueAsNegativeOrPositive(formattedInAppCurrencyValue, classifiedTx.type, { isNetworkFee, isSwapSent });
  }, [appCurrencyValue, currency, classifiedTx.type, isNetworkFee, isSwapSent]);

  const assetAmount = useMemo(() => {
    const tokenAmount = displayAssetAmount ? unitConverter.smallUnit2TokenUnit(displayAssetAmount, displayAssetMetadata?.decimals ?? 18).toString(10) : '';

    return formatTransactionValueAsNegativeOrPositive(tokenAmount, classifiedTx.type, { isNetworkFee, isSwapSent });
  }, [classifiedTx.type, displayAssetAmount, displayAssetMetadata?.decimals, isNetworkFee, isSwapSent]);

  
  const detailsAssetAmountInCurrency = useAppCurrencyValue(
    {
      
      metadata: { decimals: displayAssetMetadata?.decimals ?? 18 },
      assetId: detailsAssetId ?? '',
    },
    detailsAssetAmount ?? '',
    TRANSACTIONS_REALM_QUEUE_KEY,
  );

  const detailsAssetAmountInCurrencyFormatted = useMemo(() => {
    const formattedInAppCurrencyValue = formatCurrency(detailsAssetAmountInCurrency, { currency });

    return formatTransactionValueAsNegativeOrPositive(formattedInAppCurrencyValue, classifiedTx.type, { isNetworkFee, isSwapSent });
  }, [classifiedTx.type, currency, detailsAssetAmountInCurrency, isNetworkFee, isSwapSent]);

  const detailsAssetAmountInTokenUnit = useMemo(() => {
    const tokenAmount = detailsAssetAmount ? unitConverter.smallUnit2TokenUnit(detailsAssetAmount, displayAssetMetadata?.decimals ?? 18).toString(10) : '';

    return formatTransactionValueAsNegativeOrPositive(tokenAmount, classifiedTx.type, { isNetworkFee, isSwapSent });
  }, [detailsAssetAmount, displayAssetMetadata?.decimals, classifiedTx.type, isNetworkFee, isSwapSent]);

  
  const assetAmountAndNetworkFee = useMemo(() => {
    if (tokenAmountAndNetworkFee) {
      const tokenAmount = unitConverter.smallUnit2TokenUnit(tokenAmountAndNetworkFee, displayAssetMetadata?.decimals ?? 18).toString(10);

      return formatTransactionValueAsNegativeOrPositive(tokenAmount, classifiedTx.type, { isNetworkFee, isSwapSent });
    }

    return undefined;
  }, [classifiedTx.type, displayAssetMetadata?.decimals, isNetworkFee, isSwapSent, tokenAmountAndNetworkFee]);

  const tokenAmountAndNetworkFeeInCurrency = useAppCurrencyValue(
    {
      metadata: { decimals: displayAssetMetadata?.decimals ?? 18 },
      assetId: displayAssetId ?? '',
    },
    tokenAmountAndNetworkFee ?? '',
    TRANSACTIONS_REALM_QUEUE_KEY,
  );

  const assetAmountAndNetworkFeeInCurrencyFormatted = useMemo(() => {
    const formattedInAppCurrencyValue = formatCurrency(tokenAmountAndNetworkFeeInCurrency, { currency });

    return formatTransactionValueAsNegativeOrPositive(formattedInAppCurrencyValue, classifiedTx.type, { isNetworkFee, isSwapSent });
  }, [classifiedTx.type, currency, isNetworkFee, isSwapSent, tokenAmountAndNetworkFeeInCurrency]);

  return {
    assetAmount,
    assetAmountAndNetworkFee,
    assetAmountAndNetworkFeeInCurrencyFormatted,
    assetSymbol: displayAssetMetadata?.symbol,
    appCurrencyValue: assetAppCurrencyValue,
    detailsAssetAmount: detailsAssetAmount ? detailsAssetAmountInTokenUnit : undefined,
    detailsAssetAmountInCurrency: detailsAssetAmount ? detailsAssetAmountInCurrencyFormatted : undefined,
    description: description ?? '',
    descriptionIcon,
    icon,
    isNetworkFee,
    isSwapSent,
    title,
    status: classifiedTx.status,
  };
};
