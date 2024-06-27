import { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native/types';

import { Transaction } from '@/api/types';
import { RealmToken } from '@/realm/tokens';
import { RealmTransaction, TransactionStatus } from '@/realm/transactions';
import { NavigationProps } from '@/Routes';

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
