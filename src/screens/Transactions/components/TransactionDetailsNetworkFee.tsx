import React from 'react';

import { NetworkFee } from '@/components/NetworkFee';
import { useAppCurrencyValue } from '@/hooks/useAppCurrencyValue';
import { NativeTokenSymbol } from '@/onChain/wallets/base';
import { WalletType } from '@/onChain/wallets/registry';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { TRANSACTIONS_REALM_QUEUE_KEY } from '@/screens/Transactions/utils/types';

import { formatCurrency } from '@/utils/formatCurrency';

import { useTransactionDetailsNetworkFee } from '../utils/useTransactionDetailsNetworkFee';

type Props = {
  assetId: string;
  detached?: boolean;
  nativeTokenDecimals: number;
  nativeTokenSymbol: NativeTokenSymbol;
  networkFee?: string | null;
  networkName: WalletType | 'walletTypeUnknown';
};

const NORMAL_USE_AMOUNT = ['BTC', 'DOGE', 'SOL'];
const NORMAL_USE_PRICE = ['BTC', 'DOGE'];

export const TransactionDetailsNetworkFee = ({ assetId, detached, nativeTokenDecimals, nativeTokenSymbol, networkFee, networkName }: Props) => {
  const { amount, price } = useTransactionDetailsNetworkFee({ assetId, nativeTokenDecimals, nativeTokenSymbol, networkFee });
  const networkFeesInCurrency = useAppCurrencyValue({ assetId, metadata: { decimals: nativeTokenDecimals } }, networkFee ?? '0', TRANSACTIONS_REALM_QUEUE_KEY);
  const fee = NORMAL_USE_AMOUNT.includes(nativeTokenSymbol) ? amount : price;
  const { currency } = useAppCurrency();
  const feeInCurrency = NORMAL_USE_PRICE.includes(nativeTokenSymbol) ? price : formatCurrency(networkFeesInCurrency, { currency, highPrecision: true });

  return <NetworkFee networkName={networkName} networkFee={fee} networkFeeInCurrency={feeInCurrency} detached={detached} />;
};
