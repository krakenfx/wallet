import { useMemo } from 'react';

import type { RealmTransaction } from '@/realm/transactions';
import type { ContractInteractionData } from '@/realm/transactions/getTransactionMetadata';

type Props = {
  assetAmount: string;
  appCurrencyValue: string;
  classifiedTx: ContractInteractionData;
  description: string;
  item: RealmTransaction;
  title: string;
  symbol?: string;
};

export const useContractInteractionDetailsDisplayData = ({ assetAmount, appCurrencyValue, classifiedTx, description, item, title }: Props) => {
  const displayData = useMemo(() => {
    return {
      title,
      description,
      appCurrencyValue,
      tokenAmount: assetAmount === '' ? '0' : assetAmount,
      transactionType: classifiedTx.type,
      networkFee: item.fee,
    };
  }, [classifiedTx.type, item.fee, description, appCurrencyValue, title, assetAmount]);

  return displayData;
};
