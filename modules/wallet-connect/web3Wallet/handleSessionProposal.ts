import { CommonActions } from '@react-navigation/native';
import { Web3WalletTypes } from '@walletconnect/web3wallet';

import { hapticFeedback } from '@/utils/hapticFeedback';

import { ReactNavigationDispatch } from '../types';

export async function handleSessionProposal(proposal: Web3WalletTypes.SessionProposal, dispatch: ReactNavigationDispatch): Promise<void> {
  hapticFeedback.impactHeavy();
  return new Promise(resolve => {
    dispatch(
      CommonActions.navigate({
        name: 'ConnectApp',
        params: {
          onDone: () => {
            resolve();
          },
          walletConnectV2: { proposal },
          verified: proposal.verifyContext.verified,
        },
      }),
    );
  });
}
