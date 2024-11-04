import type { ReactElement } from 'react';

import type { Transaction } from '@/api/types';
import type { RealmToken } from '@/realm/tokens';
import type { RealmTransaction, TransactionStatus } from '@/realm/transactions';
import type { NavigationProps } from '@/Routes';

import type { StyleProp, ViewStyle } from 'react-native/types';

export type TransactionRowCommonProps = {
  item: RealmTransaction;
  parsedTx: Transaction;
  contextToken?: RealmToken;
  navigation: NavigationProps<'Transactions' | 'GlobalActivity' | 'Home'>['navigation'];
  testID?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export type DisplayData = {
  assetAmount: string;
  assetSymbol?: string;
  appCurrencyValue: string;
  description: string;
  descriptionIcon?: ReactElement;
  detailsAssetAmount?: string;
  detailsAssetAmountInCurrency?: string;
  icon?: ReactElement;
  isNetworkFee: boolean;
  isSwapSent: boolean;
  title: string;
  assetAmountAndNetworkFee?: string;
  assetAmountAndNetworkFeeInCurrencyFormatted?: string;
  status?: TransactionStatus['status'];
};
