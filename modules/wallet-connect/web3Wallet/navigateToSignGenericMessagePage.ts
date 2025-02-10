import { CommonActions } from '@react-navigation/native';

import type { WalletConnectSignRequest_GenericMessageParams } from '@/screens/AppSignRequest';
import type { Warning } from '@/types';
import { hapticFeedback } from '@/utils/hapticFeedback';

import type { DefinitionList, GenericMessage, ReactNavigationDispatch } from '../types';

export function navigateToSignGenericMessagePage(
  dispatch: ReactNavigationDispatch,
  accountIdx: number,
  metadata: {
    imageUrl?: string;
    name: string;
    url: string;
  },
  genericMessage: GenericMessage,
  detailsContent?: DefinitionList,
  warning?: Warning,
) {
  return new Promise<boolean>(resolve => {
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
