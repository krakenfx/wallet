import { NavigationHelpers, ParamListBase } from '@react-navigation/native';

import { SessionTypes } from '@walletconnect/types';

import { TransactionAmountProps } from '@/components/Transaction/TransactionAmount';
import { TRANSACTION_TYPES } from '@/realm/transactions/const';

import { EIP712 } from './web3Wallet/ethereum';

export type SessionNamespace =
  | {
      eip155: SessionTypes.BaseNamespace;
      solana: SessionTypes.BaseNamespace;
    }
  | {
      eip155: SessionTypes.BaseNamespace;
    }
  | {
      solana: SessionTypes.BaseNamespace;
    }
  | Record<string, never>;

export type DefinitionList = { title: string; description: string }[];
export type GenericSignContent = string | DefinitionList;

export type TransactionContent =
  | { type: 'default'; assetContent: TransactionAmountProps[] }
  | { type: TRANSACTION_TYPES.SWAP; assetContent: [TransactionAmountProps, TransactionAmountProps] }
  | { type: TRANSACTION_TYPES.TOKEN_APPROVAL; assetContent: [TransactionAmountProps] }
  | { type: TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED; subtitle: string | string[]; assetContent: [] };


export type GenericMessage = {
  type: 'generic-message';
  address: string;
  heading?: string;
  message: DefinitionList;
  rawMessage?: string | EIP712;
};

export type ReactNavigationDispatch = NavigationHelpers<ParamListBase>['dispatch'];
