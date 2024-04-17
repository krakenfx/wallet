import { CommonActions } from '@react-navigation/native';

import { WalletConnectSignRequest_GenericMessageParams } from '@/screens/AppSignRequest';
import { Warning } from '@/types';
import { hapticFeedback } from '@/utils/hapticFeedback';

import { DefinitionList, GenericMessage, ReactNavigationDispatch } from '../types';

export function navigateToSignGenericMessagePage(
  dispatch: ReactNavigationDispatch,
  accountIdx: number,
  metadata: {
    imageUrl: string;
    name: string;
    url: string;
  },
  genericMessage: GenericMessage,
  detailsContent: DefinitionList,
  warning?: Warning,
): Promise<boolean> {
  return new Promise(resolve => {
    const params: WalletConnectSignRequest_GenericMessageParams = {
      accountIdx,
      metadata,
      genericMessage,
      detailsContent,
      onApprove: () => resolve(true),
      onReject: () => resolve(false),
      warning,
    };
    hapticFeedback.impactHeavy();
    dispatch(
      CommonActions.navigate({
        name: 'WalletConnectSignRequest_GenericMessage',
        params,
      }),
    );
  });
}
