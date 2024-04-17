import { Verify } from '@walletconnect/types';
import React, { useState } from 'react';

import { BlockScreenSheet } from '@/components/BlockScreen';
import navigationStyle from '@/components/navigationStyle';
import { NavigationProps } from '@/Routes';

import { ConnectAppUI } from './components/ConnectAppUI';
import { useConnectApp3rdPartyAPI } from './hooks/useConnectApp3rdPartyAPI';
import { SessionProposal, UI_STATE } from './types';

import loc from '/loc';
import { getVerificationFromWalletConnectVerify } from '/modules/wallet-connect/utils';

export type ConnectAppParams = { walletConnectV2: { proposal: SessionProposal }; onDone: () => void; verified: Verify.Context['verified'] };

export const ConnectAppScreen = ({ route }: NavigationProps<'ConnectApp'>) => {
  const verification = getVerificationFromWalletConnectVerify(route.params.verified);
  const [showBlockScreen, setShowBlockScreen] = useState(verification.isScam);

  const [uiState, setUIState] = useState(UI_STATE.loading);
  const _3rdPartyAPI = useConnectApp3rdPartyAPI(route.params, setUIState);
  const rejectSession = async () => {
    await _3rdPartyAPI.rejectSession?.();
    route.params.onDone();
  };

  return showBlockScreen ? (
    <BlockScreenSheet
      onGoBack={rejectSession}
      onProceed={() => setShowBlockScreen(false)}
      title={loc.onChainSecurity.knownSecurityRiskExclamation}
      message={loc.onChainSecurity.knownSecurityRiskMessage}
    />
  ) : (
    <ConnectAppUI
      appMetadata={_3rdPartyAPI.appMetadata}
      networkIDs={_3rdPartyAPI.networkIDs}
      requiredNetworkIDs={_3rdPartyAPI.requiredNetworkIDs}
      uiState={uiState}
      approveSession={async () => {
        await _3rdPartyAPI.approveSession?.();
        route.params.onDone();
      }}
      rejectSession={rejectSession}
      verification={verification}
    />
  );
};

ConnectAppScreen.navigationOptions = navigationStyle({
  presentation: 'transparentModal',
  headerShown: false,
});
