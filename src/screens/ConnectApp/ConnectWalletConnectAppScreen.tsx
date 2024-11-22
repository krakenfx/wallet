import { useState } from 'react';

import type { NavigationProps } from '@/Routes';
import { ConnectAppWithBlock } from '@/screens/ConnectApp/components/ConnectAppWithBlock';
import { navigationStyle } from '@/utils/navigationStyle';

import { useConnectApp3rdPartyAPI } from './hooks/useConnectApp3rdPartyAPI';

import { UI_STATE } from './types';

import type { SessionProposal } from './types';
import type { Verify } from '@walletconnect/types';

import { getVerificationFromWalletConnectVerify } from '/modules/wallet-connect/utils';

export type ConnectWalletConnectAppParams = {
  walletConnectV2: { proposal: SessionProposal };
  onDone: () => void;
  verified: Verify.Context['verified'];
  isMalicious: boolean | null;
};

export const ConnectWalletConnectAppScreen = ({ route }: NavigationProps<'ConnectWalletConnectApp'>) => {
  const verification = getVerificationFromWalletConnectVerify(route.params.verified);
  const [uiState, setUIState] = useState(UI_STATE.loading);
  const _3rdPartyAPI = useConnectApp3rdPartyAPI(route.params, setUIState);
  const rejectSession = async () => {
    await _3rdPartyAPI.rejectSession?.();
    route.params.onDone();
  };
  const approveSession = async () => {
    await _3rdPartyAPI.approveSession?.();
    route.params.onDone();
  };

  return (
    <ConnectAppWithBlock
      appMetadata={_3rdPartyAPI.appMetadata}
      networkIDs={_3rdPartyAPI.networkIDs}
      requiredNetworkIDs={_3rdPartyAPI.requiredNetworkIDs}
      uiState={uiState}
      onApprove={approveSession}
      onReject={rejectSession}
      verification={verification}
      isMalicious={route.params.isMalicious}
    />
  );
};

ConnectWalletConnectAppScreen.navigationOptions = navigationStyle({
  presentation: 'transparentModal',
  headerShown: false,
});
