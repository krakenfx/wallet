import noop from 'lodash/noop';
import React, { useEffect } from 'react';

import { ExpandableSheet } from '@/components/Sheets';
import { hapticFeedback } from '@/utils/hapticFeedback';

import { UI_STATE } from '../types';

import { Footer } from './Footer';
import { Preview } from './Preview';

import type { Verification } from '../types';
import type { ProposalTypes } from '@walletconnect/types';
import type { Web3WalletTypes } from '@walletconnect/web3wallet';

import { useWalletConnectSupportedNetworkIds } from '/modules/wallet-connect/hooks';

type SessionProposal = Omit<Web3WalletTypes.BaseEventArgs<ProposalTypes.Struct>, 'topic'>;

export interface ConnectAppParams {
  proposal: SessionProposal;
}

type Props = {
  appMetadata?: {
    url: string;
    name: string;
    icon: string;
  };
  networkIDs?: string[];
  requiredNetworkIDs?: string[];
  approveSession?: () => Promise<void>;
  rejectSession?: () => Promise<void>;
  uiState: UI_STATE.none | UI_STATE.loading | UI_STATE.complete;
  verification?: Verification;
  isMalicious: boolean | null;
  dismissedWarning: boolean;
};

export const ConnectApp = ({
  appMetadata,
  networkIDs,
  requiredNetworkIDs,
  uiState,
  approveSession,
  rejectSession,
  verification,
  isMalicious,
  dismissedWarning,
}: Props) => {
  const isDataComplete =
    appMetadata !== undefined && approveSession !== undefined && networkIDs !== undefined && requiredNetworkIDs !== undefined && rejectSession !== undefined;
  const walletConnectSupportedNetworkIds = useWalletConnectSupportedNetworkIds();
  
  const unsupportedRequiredNetworks: string[] = (requiredNetworkIDs || []).filter(networkID => !walletConnectSupportedNetworkIds.includes(networkID));
  const hasUnsupportedRequiredNetworks = unsupportedRequiredNetworks.length > 0;
  const supportedNetworks: string[] = (networkIDs || []).filter(networkID => walletConnectSupportedNetworkIds.includes(networkID));
  const hasSupportedNetworks = supportedNetworks.length > 0;

  const shouldDisableConfirmation = hasUnsupportedRequiredNetworks || !hasSupportedNetworks;

  useEffect(() => {
    if (uiState === UI_STATE.complete && isDataComplete) {
      hapticFeedback.notificationSuccess();
    }
  }, [isDataComplete, uiState]);

  return (
    <ExpandableSheet
      dismissible
      onDismiss={rejectSession || noop}
      PreviewComponent={
        <Preview
          isDataComplete={isDataComplete}
          shouldDisableConfirmation={shouldDisableConfirmation}
          appMetadata={appMetadata}
          uiState={uiState}
          verification={verification}
          unsupportedRequiredNetworks={unsupportedRequiredNetworks}
          supportedNetworks={supportedNetworks}
          isMalicious={isMalicious}
          dismissedWarning={dismissedWarning}
        />
      }
      FloatingButtonsComponent={
        <Footer
          uiState={uiState}
          verification={verification}
          shouldDisableConfirmation={shouldDisableConfirmation}
          isDataComplete={isDataComplete}
          approveSession={approveSession}
          rejectSession={rejectSession}
        />
      }
    />
  );
};
