import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useAppCurrencyValue } from '@/hooks/useAppCurrencyValue';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { RealmToken } from '@/realm/tokens';
import { RealmTransaction } from '@/realm/transactions';
import { TRANSACTION_TYPES } from '@/realm/transactions/const';
import { NFTTransactionData } from '@/realm/transactions/getTransactionMetadata';

import { TRANSACTIONS_REALM_QUEUE_KEY } from '@/screens/Transactions/utils/types';

import { formatCurrency } from '@/utils/formatCurrency';

import { formatNftAmount } from './formatNftAmount';
import { formatTransactionValueAsNegativeOrPositive } from './formatTransactionValueAsNegativeOrPositive';

export const useNftAmounts = (classifiedTx: NFTTransactionData, item: RealmTransaction, contextToken: RealmToken, isGlobalView?: boolean) => {
  const { currency } = useAppCurrency();

  const assetAmountFormatted = useMemo(() => {
    const formatted = formatNftAmount(classifiedTx.type, {
      currency,
      decimals: contextToken?.metadata.decimals,
      tokenAmount: classifiedTx?.paymentToken?.amount ?? item.fee ?? '0',
      assetId: classifiedTx?.paymentToken?.assetId ?? '',
    });

    return formatted === '' ? '0' : formatted;
  }, [classifiedTx, contextToken?.metadata.decimals, currency, item.fee]);
  const assetAmountInCurrency = useAppCurrencyValue(contextToken, classifiedTx?.paymentToken?.amount ?? item.fee ?? '0', TRANSACTIONS_REALM_QUEUE_KEY);
  const assetAmountInCurrencyFormatted = useMemo(() => {
    if (classifiedTx.type === TRANSACTION_TYPES.NFT_RECEIVE) {
      return '';
    }

    const formattedInAppCurrencyValue = formatCurrency(assetAmountInCurrency, { currency });

    return formatTransactionValueAsNegativeOrPositive(formattedInAppCurrencyValue, classifiedTx.type);
  }, [assetAmountInCurrency, classifiedTx, currency]);

  const tokenAmountAndNetworkFee = useMemo(() => {
    if (classifiedTx.type === TRANSACTION_TYPES.NFT_RECEIVE) {
      return classifiedTx?.paymentToken?.amount ?? item.fee ?? '0';
    } else {
      const paymentTokenAmount = classifiedTx?.paymentToken?.amount ?? '0';

      const networkFee = isGlobalView ? '0' : item.fee ?? '0';
      const transactionValue = BigNumber.sum(paymentTokenAmount, -networkFee).toFixed();

      return transactionValue;
    }
  }, [classifiedTx?.paymentToken?.amount, classifiedTx.type, isGlobalView, item.fee]);
  const assetAmountAndNetworkFeeFormatted = useMemo(
    () =>
      formatNftAmount(classifiedTx.type, {
        currency,
        decimals: contextToken?.metadata.decimals,
        tokenAmount: tokenAmountAndNetworkFee,
        assetId: contextToken?.assetId ?? '',
      }),
    [classifiedTx.type, contextToken?.assetId, contextToken?.metadata?.decimals, currency, tokenAmountAndNetworkFee],
  );
  const assetAmountAndNetworkFeeInCurrency = useAppCurrencyValue(contextToken, tokenAmountAndNetworkFee, TRANSACTIONS_REALM_QUEUE_KEY);
  const assetAmountAndNetworkFeeInCurrencyFormatted = useMemo(() => {
    if (classifiedTx.type === TRANSACTION_TYPES.NFT_RECEIVE) {
      return '';
    }

    const formattedInAppCurrencyValue = formatCurrency(assetAmountAndNetworkFeeInCurrency, { currency });

    return formatTransactionValueAsNegativeOrPositive(formattedInAppCurrencyValue, classifiedTx.type);
  }, [assetAmountAndNetworkFeeInCurrency, classifiedTx, currency]);

  return { assetAmountFormatted, assetAmountInCurrencyFormatted, assetAmountAndNetworkFeeFormatted, assetAmountAndNetworkFeeInCurrencyFormatted };
};
