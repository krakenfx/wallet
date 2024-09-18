import { ProposalTypes } from '@walletconnect/types';
import { Web3WalletTypes } from '@walletconnect/web3wallet';
import LottieView from 'lottie-react-native';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { CardWarning, CardWarningFromWarning } from '@/components/CardWarning';
import { ConnectAppPermissions } from '@/components/ConnectAppPermissions';

import { UI_STATE, Verification } from '../types';

import { Header } from './Header';
import { Info } from './Info';

import { capitalizeFirstLetter } from '/helpers/capitalizeFirstLetter';
import loc from '/loc';

type SessionProposal = Omit<Web3WalletTypes.BaseEventArgs<ProposalTypes.Struct>, 'topic'>;

export interface ConnectAppParams {
  proposal: SessionProposal;
}

type PreviewProps = {
  appMetadata?: {
    url: string;
    name: string;
    icon: string;
  };
  shouldDisableConfirmation: boolean;
  unsupportedRequiredNetworks: string[];
  supportedNetworks: string[];
  uiState: UI_STATE.none | UI_STATE.loading | UI_STATE.complete;
  verification: Verification;
  isDataComplete: boolean;
};

export const Preview: React.FC<PreviewProps> = ({
  isDataComplete,
  shouldDisableConfirmation,
  appMetadata,
  uiState,
  verification,
  unsupportedRequiredNetworks,
  supportedNetworks,
}: PreviewProps) => {
  const { height } = useSafeAreaFrame();

  if (uiState === UI_STATE.loading || !isDataComplete) {
    return (
      <View style={[styles.stateContainer, { minHeight: height / 2 }]}>
        <ActivityIndicator size="large" color="rgba(92, 51, 255, 1)" />
      </View>
    );
  }

  if (uiState === UI_STATE.complete) {
    return (
      <View style={[styles.stateContainer, { minHeight: height / 2 }]}>
        <View style={styles.lottie}>
          <LottieView source={require('@/assets/lottie/successCheckmark.json')} style={StyleSheet.absoluteFill} autoPlay loop={false} />
        </View>
      </View>
    );
  }

  if (uiState === UI_STATE.none && !!appMetadata) {
    return (
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
    );
  }

  return null;
};






const formatUnsupportedNetwork = (network: string) => {
  const colonIndex = network.split('').findIndex(c => c === ':');
  const isEIP = network.startsWith('eip155');

  return !isEIP && colonIndex > -1 ? capitalizeFirstLetter(network.slice(0, colonIndex)) : network;
};

function formatCardWarningDescription(unsupportedNetworks: string[]) {
  let result: string | string[];

  if (unsupportedNetworks.length === 1) {
    result = loc.formatString(loc.connectApp.unsupportedNetworkDescription, {
      unsupportedNetwork: formatUnsupportedNetwork(unsupportedNetworks[0]),
    });
  } else {
    result = loc.formatString(loc.connectApp.unsupportedNetworksDescription, {
      unsupportedNetworks: unsupportedNetworks.map(formatUnsupportedNetwork).join(', '),
    });
  }

  return Array.isArray(result) ? result.join(' ') : result;
}

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
});
