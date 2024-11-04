import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { GradientPanelFooter, GradientPanelHeader } from '@/components/GradientPanel';

import { Label } from '@/components/Label';
import { NetworkIDIcons } from '@/components/NetworkIDIcons';
import { SvgIcon } from '@/components/SvgIcon';
import { TokenIcon } from '@/components/TokenIcon';
import { Touchable } from '@/components/Touchable';
import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import { Routes } from '@/Routes';
import { EXPLAINER_CONTENT_TYPES } from '@/screens/Explainer';

import { FeatureFlag, NEW_EVM_NETWORKS, useFeatureFlagEnabled } from '@/utils/featureFlags';

import { DerivationPath } from './DerivationPath';

import loc from '/loc';

export const EvmPanel = ({ derivationPath }: { derivationPath: string }) => {
  const navigation = useNavigation();
  const showExplainer = useCallback(() => {
    navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.ETHEREUM_DERIVATION_PATH });
  }, [navigation]);
  const isNewNetworksEnabled = useFeatureFlagEnabled(FeatureFlag.NewNetworksEnabled);

  const networkIDs = [
    ChainAgnostic.NETWORK_ETHEREUM,
    ChainAgnostic.NETWORK_POLYGON,
    ChainAgnostic.NETWORK_ARBITRUM,
    ChainAgnostic.NETWORK_OPTIMISM,
    ChainAgnostic.NETWORK_BASE,
    ...(isNewNetworksEnabled ? NEW_EVM_NETWORKS : []),
  ];

  return (
    <View>
      <GradientPanelHeader>
        <View style={styles.panelHeader}>
          <TokenIcon networkName="ethereum" forceOmitNetworkIcon />
          <View>
            <View style={styles.row}>
              <Label type="boldTitle2">Ethereum</Label>
              <NetworkIDIcons align="left" networkIDs={networkIDs} />
            </View>
            <Touchable onPress={showExplainer} style={styles.row}>
              <Label type="regularCaption1" color="light75">
                {loc.advancedAccountInfo.includesCompatibleNetworks}
              </Label>
              <SvgIcon name="info-circle" color="light50" size={16} />
            </Touchable>
          </View>
        </View>
      </GradientPanelHeader>
      <GradientPanelFooter>
        <View style={styles.panel}>
          <DerivationPath derivationPath={derivationPath} />
        </View>
      </GradientPanelFooter>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 12,
    paddingTop: 12,
  },
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
});
