import type React from 'react';

import noop from 'lodash/noop';
import { View } from 'react-native';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';

import { useSettingsMutations } from '@/realm/settings';

import { UI_STATE } from '../types';

import type { Verification } from '../types';

import { biometricUnlock } from '/helpers/biometric-unlock';

import loc from '/loc';

interface FooterProps {
  isDataComplete: boolean;
  shouldDisableConfirmation: boolean;
  shouldDisableCancelation: boolean;
  uiState: UI_STATE.none | UI_STATE.loading | UI_STATE.complete;
  verification?: Verification;
  approveSession?: () => Promise<void>;
  rejectSession?: () => Promise<void>;
}

export const Footer: React.FC<FooterProps> = ({
  uiState,
  isDataComplete,
  shouldDisableConfirmation,
  shouldDisableCancelation,
  verification,
  approveSession,
  rejectSession,
}) => {
  const isCriticalWarning = verification?.warning?.severity === 'critical';
  const { setWalletConnectExplainerTaskCompleted } = useSettingsMutations();

  const handleApproveSession = async () => {
    if (await biometricUnlock()) {
      approveSession?.();
      setWalletConnectExplainerTaskCompleted();
    }
  };

  if (uiState !== UI_STATE.none || !isDataComplete) {
    return null;
  }

  return (
    <View>
      <FloatingBottomButtons
        noAbsolutePosition
        primary={{
          text: loc.connectApp.connect,
          color: isCriticalWarning ? 'red400' : undefined,
          onPress: handleApproveSession || noop,
          disabled: shouldDisableConfirmation,
        }}
        secondary={{
          text: loc.connectApp.cancel,
          onPress: rejectSession || noop,
          disabled: shouldDisableCancelation,
        }}
      />
    </View>
  );
};
