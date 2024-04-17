import { useMemo } from 'react';

import { useAppCurrencyValue } from '@/hooks/useAppCurrencyValue';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { TransactionData } from '@/realm/transactions/getTransactionMetadata';
import { DisplayData } from '@/screens/Transactions/components/types';
import { TRANSACTIONS_REALM_QUEUE_KEY } from '@/screens/Transactions/utils/types';

import { formatTransactionValueAsNegativeOrPositive } from '../formatTransactionValueAsNegativeOrPositive';

import { getTransactionDisplayData } from './getTransactionDisplayData';

import { amountInTokenUnitShortened, formatAppCurrencyValue } from '/modules/text-utils';

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
    const formattedInAppCurrencyValue = formatAppCurrencyValue(appCurrencyValue, currency);

    return formatTransactionValueAsNegativeOrPositive(formattedInAppCurrencyValue, classifiedTx.type, { isNetworkFee, isSwapSent });
  }, [appCurrencyValue, currency, classifiedTx.type, isNetworkFee, isSwapSent]);

  const assetAmount = useMemo(() => {
    const amountShortened_ = displayAssetAmount ? amountInTokenUnitShortened(displayAssetAmount, displayAssetMetadata?.decimals ?? 18) : '';

    return formatTransactionValueAsNegativeOrPositive(amountShortened_, classifiedTx.type, { isNetworkFee, isSwapSent });
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
    const formattedInAppCurrencyValue = formatAppCurrencyValue(detailsAssetAmountInCurrency, currency);

    return formatTransactionValueAsNegativeOrPositive(formattedInAppCurrencyValue, classifiedTx.type, { isNetworkFee, isSwapSent });
  }, [classifiedTx.type, currency, detailsAssetAmountInCurrency, isNetworkFee, isSwapSent]);

  const detailsAssetAmountFormatted = useMemo(() => {
    const amountShortened_ = detailsAssetAmount ? amountInTokenUnitShortened(detailsAssetAmount, displayAssetMetadata?.decimals ?? 18) : '';

    return formatTransactionValueAsNegativeOrPositive(amountShortened_, classifiedTx.type, { isNetworkFee, isSwapSent });
  }, [detailsAssetAmount, displayAssetMetadata?.decimals, classifiedTx.type, isNetworkFee, isSwapSent]);

  const assetAmountAndNetworkFeeFormatted = useMemo(() => {
    if (tokenAmountAndNetworkFee) {
      const amountShortened_ = amountInTokenUnitShortened(tokenAmountAndNetworkFee, displayAssetMetadata?.decimals ?? 18);

      return formatTransactionValueAsNegativeOrPositive(amountShortened_, classifiedTx.type, { isNetworkFee, isSwapSent });
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
    const formattedInAppCurrencyValue = formatAppCurrencyValue(tokenAmountAndNetworkFeeInCurrency, currency);

    return formatTransactionValueAsNegativeOrPositive(formattedInAppCurrencyValue, classifiedTx.type, { isNetworkFee, isSwapSent });
  }, [classifiedTx.type, currency, isNetworkFee, isSwapSent, tokenAmountAndNetworkFeeInCurrency]);

  return {
    assetAmount,
    assetAmountAndNetworkFeeFormatted,
    assetAmountAndNetworkFeeInCurrencyFormatted,
    assetSymbol: displayAssetMetadata?.symbol,
    appCurrencyValue: assetAppCurrencyValue,
    detailsAssetAmount: detailsAssetAmount ? detailsAssetAmountFormatted : undefined,
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
