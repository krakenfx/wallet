import { useState } from 'react';

import { BlockScreenSheet } from '@/components/BlockScreen';

import { UI_STATE, type Verification } from '../types';

import { ConnectApp } from './ConnectApp';

import loc from '/loc';

export type Props = {
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  isMalicious: boolean | null;
  verification?: Verification;
  appMetadata?: {
    url: string;
    name: string;
    icon?: string;
  };
  networkIDs?: string[];
  requiredNetworkIDs?: string[];
  uiState: UI_STATE.none | UI_STATE.loading | UI_STATE.complete | undefined;
};

export const ConnectAppWithBlock = (props: Props) => {
  const [dismissed, setDismissed] = useState(false);
  const { verification, appMetadata, networkIDs, onApprove, onReject, requiredNetworkIDs, uiState } = props;
  const [uiUncontrolledState, setUiUncontrolledState] = useState<UI_STATE>(UI_STATE.none);
  const state = uiState || uiUncontrolledState;

  if (props.isMalicious === true && !dismissed) {
    return (
      <BlockScreenSheet
        onGoBack={onReject}
        onProceed={() => setDismissed(true)}
        title={loc.onChainSecurity.knownSecurityRiskExclamation}
        message={loc.onChainSecurity.knownSecurityRiskMessage}
      />
    );
  }

  const handleApprove = async () => {
    const delayCallback = props.uiState ? 0 : 2000;
    setTimeout(() => {
      onApprove();
    }, delayCallback);
    setUiUncontrolledState(UI_STATE.complete);
  };

  return (
    <ConnectApp
      appMetadata={appMetadata}
      networkIDs={networkIDs}
      requiredNetworkIDs={requiredNetworkIDs}
      uiState={state}
      approveSession={handleApprove}
      rejectSession={onReject}
      verification={verification}
      isMalicious={props.isMalicious}
      dismissedWarning={dismissed}
    />
  );
};
