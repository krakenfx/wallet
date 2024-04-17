import { BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import { ProposalTypes } from '@walletconnect/types';
import { Web3WalletTypes } from '@walletconnect/web3wallet';
import noop from 'lodash/noop';
import LottieView from 'lottie-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { CardWarning, CardWarningFromWarning } from '@/components/CardWarning';
import { ConnectAppPermissions } from '@/components/ConnectAppPermissions';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';

import { ExpandableSheet } from '@/components/Sheets';
import { useSettingsMutations } from '@/realm/settings';
import { hapticFeedback } from '@/utils/hapticFeedback';

import { UI_STATE, Verification } from '../types';

import { Header } from './Header';
import { Info } from './Info';

import { biometricUnlock } from '/helpers/biometric-unlock';
import { capitalizeFirstLetter } from '/helpers/capitalizeFirstLetter';
import loc from '/loc';
import { WALLET_CONNECT_SUPPORTED_NETWORK_IDS } from '/modules/wallet-connect/consts';

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
  approveSession?: () => Promise<void>;
  networkIDs?: string[];
  requiredNetworkIDs?: string[];
  rejectSession?: () => Promise<void>;
  uiState: UI_STATE.none | UI_STATE.loading | UI_STATE.complete;
  verification: Verification;
};

const formatUnsupportedNetwork = (network: string) => {
  const colonIndex = network.split('').findIndex(c => c === ':');
  const isEIP = network.startsWith('eip155');

  return !isEIP && colonIndex > -1 ? capitalizeFirstLetter(network.slice(0, colonIndex)) : network;
};

const formatCardWarningDescription = (unsupportedNetworks: string[]) => {
  const result =
    unsupportedNetworks.length === 1
      ? loc.formatString(loc.connectApp.unsupportedNetworkDescription, { unsupportedNetwork: formatUnsupportedNetwork(unsupportedNetworks[0]) })
      : loc.formatString(loc.connectApp.unsupportedNetworksDescription, {
          unsupportedNetworks: unsupportedNetworks.map(formatUnsupportedNetwork).join(', '),
        });
  return Array.isArray(result) ? result.join(' ') : result;
};

export const ConnectAppUI = ({ appMetadata, networkIDs, requiredNetworkIDs, uiState, approveSession, rejectSession, verification }: Props) => {
  const isDataComplete =
    appMetadata !== undefined && approveSession !== undefined && networkIDs !== undefined && requiredNetworkIDs !== undefined && rejectSession !== undefined;

  const unsupportedRequiredNetworks: string[] = (requiredNetworkIDs || []).filter(networkID => !WALLET_CONNECT_SUPPORTED_NETWORK_IDS.includes(networkID));
  const hasUnsupportedRequiredNetworks = unsupportedRequiredNetworks.length > 0;
  const supportedNetworks: string[] = (networkIDs || []).filter(networkID => WALLET_CONNECT_SUPPORTED_NETWORK_IDS.includes(networkID));
  const hasSupportedNetworks = supportedNetworks.length > 0;
  const shouldDisableConfirmation = hasUnsupportedRequiredNetworks || !hasSupportedNetworks;
  const { height } = useSafeAreaFrame();
  const { setWalletConnectExplainerNeeded } = useSettingsMutations();
  const isCriticalWarning = verification.warning?.severity === 'critical';
  const renderFooter = React.useCallback(
    (props: BottomSheetFooterProps) => {
      const handleApproveSession = async () => {
        if (await biometricUnlock()) {
          approveSession?.();
          setWalletConnectExplainerNeeded(false);
        }
      };
      return (
        <View {...props}>
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
            }}
          />
        </View>
      );
    },
    [isCriticalWarning, shouldDisableConfirmation, rejectSession, approveSession, setWalletConnectExplainerNeeded],
  );

  useEffect(() => {
    if (uiState === UI_STATE.complete && isDataComplete) {
      hapticFeedback.notificationSuccess();
    }
  }, [isDataComplete, uiState]);

  const renderPreview = () => {
    return (
      <>
        {(uiState === UI_STATE.loading || !isDataComplete) && (
          <View style={[styles.stateContainer, { minHeight: height / 2 }]}>
            <ActivityIndicator size="large" color="rgba(92, 51, 255, 1)" />
          </View>
        )}
        {uiState === UI_STATE.complete && isDataComplete && (
          <View style={[styles.stateContainer, { minHeight: height / 2 }]}>
            <View style={styles.lottie}>
              <LottieView source={require('@/assets/lottie/broadcastSent.json')} style={StyleSheet.absoluteFill} autoPlay loop={false} />
            </View>
          </View>
        )}
        {uiState === UI_STATE.none && isDataComplete && (
          <View style={styles.container}>
            <Header url={appMetadata.url} icon={appMetadata.icon} name={appMetadata.name} verification={verification} />
            {shouldDisableConfirmation ? (
              <CardWarning title={loc.connectApp.unsupportedNetwork} description={formatCardWarningDescription(unsupportedRequiredNetworks)} type="negative" />
            ) : (
              <View style={styles.permissionsContainer}>
                {verification.warning && <CardWarningFromWarning warning={verification.warning} />}
                <ConnectAppPermissions />
              </View>
            )}
            <View style={styles.infoContainer}>
              <Info networkIDs={shouldDisableConfirmation ? unsupportedRequiredNetworks : supportedNetworks} />
            </View>
          </View>
        )}
      </>
    );
  };

  return (
    <ExpandableSheet
      dismissible
      onDismiss={rejectSession || noop}
      PreviewComponent={renderPreview}
      FloatingButtonsComponent={uiState === UI_STATE.none && isDataComplete ? renderFooter : null}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 24,
  },
  permissionsContainer: {
    gap: 16,
  },
  infoContainer: {
    marginVertical: 16,
  },
  stateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    height: 120,
    width: 120,
  },
  warningContainer: {
    marginBottom: 12,
  },
});
