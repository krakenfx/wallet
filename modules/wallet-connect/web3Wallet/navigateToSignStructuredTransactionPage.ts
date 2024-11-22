import { CommonActions } from '@react-navigation/native';

import type { FeeOption } from '@/api/types';
import type { PreparedTransaction } from '@/onChain/wallets/base';
import type { EVMNetwork } from '@/onChain/wallets/evm';
import { TRANSACTION_TYPES } from '@/realm/transactions/const';
import type { RealmWallet } from '@/realm/wallets';
import type { WalletConnectSignRequest_StructuredTransactionParams } from '@/screens/AppSignRequest/WalletConnectSignRequest_StructuredTransactionScreen';
import type { Currency } from '@/screens/Settings/currency';
import type { Warning } from '@/types';
import { hapticFeedback } from '@/utils/hapticFeedback';

import type { DefinitionList, TransactionContent } from '../types';

import type { TransactionRequest } from 'ethers';

import loc from '/loc';
import { buildAssetContent, classifyTransaction, getTransactionPageTitle } from '/modules/wallet-connect/web3Wallet/ethereum';

type GetSignStructuredParamsFromTransactionProps = {
  method: string;
  preparedTransaction: PreparedTransaction<TransactionRequest>;
  network: EVMNetwork;
  currency: Currency;
  dappName?: string;
};

export async function getSignStructuredParamsFromTransaction({
  method,
  preparedTransaction,
  network,
  currency,
  dappName,
}: GetSignStructuredParamsFromTransactionProps): Promise<{
  transactionTitle: string | string[];
  content: TransactionContent;
}> {
  const classifiedTransaction = await classifyTransaction(preparedTransaction.effects);
  const assetContent = await buildAssetContent(classifiedTransaction, network, currency);
  const getTransactionContent = (): TransactionContent => {
    if (classifiedTransaction.kind === 'swap') {
      return { type: TRANSACTION_TYPES.SWAP, assetContent: [assetContent[0], assetContent[1]] };
    }

    if (classifiedTransaction.type === TRANSACTION_TYPES.TOKEN_APPROVAL) {
      return {
        type: TRANSACTION_TYPES.TOKEN_APPROVAL,
        assetContent: [assetContent[0]],
      };
    }

    if (classifiedTransaction.type === TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED) {
      return {
        type: TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED,
        subtitle: loc.formatString(loc.appSignRequest.allowAccessDescription, {
          dappName: dappName ?? loc.appSignRequest.unknownApp,
          tokenSymbol: assetContent[0]?.assetSymbol ?? '',
        }),
        assetContent: [],
      };
    }

    return { type: 'default', assetContent };
  };
  return {
    transactionTitle: getTransactionPageTitle(classifiedTransaction.type, {
      method,
      tokenSymbol: classifiedTransaction.type === TRANSACTION_TYPES.TOKEN_APPROVAL_UNLIMITED ? (assetContent[0]?.assetSymbol ?? '') : '',
    }),
    content: getTransactionContent(),
  };
}

type Props = {
  dispatch: (action: ReturnType<typeof CommonActions.navigate>) => void;
  wallet: RealmWallet;
  metadata: {
    imageUrl?: string;
    name?: string;
    url?: string;
  };
  transactionTitle: string | string[];
  content: TransactionContent;
  detailsContent: DefinitionList;
  preparedTransaction: PreparedTransaction;
  hideFeeSelector?: boolean;
  warning?: Warning;
};

export function navigateToSignStructuredTransactionPage({
  dispatch,
  wallet,
  metadata,
  transactionTitle,
  content,
  detailsContent,
  preparedTransaction,
  hideFeeSelector,
  warning,
}: Props): Promise<{ approveSignRequest: boolean; fee: FeeOption | null }> {
  return new Promise(resolve => {
    const params: WalletConnectSignRequest_StructuredTransactionParams = {
      content,
      detailsContent,
      walletId: wallet.id,
      metadata,
      transactionTitle,
      preparedTransaction,
      hideFeeSelector,
      onApprove: (fee: FeeOption | null) => resolve({ approveSignRequest: true, fee }),
      onReject: () => resolve({ approveSignRequest: false, fee: null }),
      warning,
    };
    hapticFeedback.impactHeavy();
    dispatch(
      CommonActions.navigate({
        name: 'WalletConnectSignRequest_StructuredTransaction',
        params,
      }),
    );
  });
}
