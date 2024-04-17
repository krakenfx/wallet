import { CommonActions } from '@react-navigation/native';

import { FeeOption } from '@/api/types';
import { PreparedTransaction } from '@/onChain/wallets/base';
import { RealmWallet } from '@/realm/wallets';
import { WalletConnectSignRequest_StructuredTransactionParams } from '@/screens/AppSignRequest/WalletConnectSignRequest_StructuredTransactionScreen';
import { Warning } from '@/types';
import { hapticFeedback } from '@/utils/hapticFeedback';

import { DefinitionList, TransactionContent } from '../types';

type Props = {
  dispatch: (action: ReturnType<typeof CommonActions.navigate>) => void;
  wallet: RealmWallet;
  metadata: {
    imageUrl: string;
    name: string;
    url: string;
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
