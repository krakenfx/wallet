import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GradientPanel, GradientPanelFooter, GradientPanelHeader } from '@/components/GradientPanel';
import { Label } from '@/components/Label';
import { TokenIcon } from '@/components/TokenIcon';

import { DerivationPath } from './DerivationPath';
import { ExtendedPublicKey } from './ExtendedPublicKey';

import loc from '/loc';

export const BitcoinPanel = ({ accountNumber, derivationPath }: { accountNumber: number; derivationPath: string }) => {
  return (
    <View>
      <GradientPanelHeader>
        <View style={styles.panelHeader}>
          <TokenIcon networkName="HDsegwitBech32" forceOmitNetworkIcon />
          <Label type="boldTitle2">Bitcoin</Label>
        </View>
      </GradientPanelHeader>
      <GradientPanel>
        <View style={styles.panel}>
          <DerivationPath derivationPath={derivationPath} />
        </View>
      </GradientPanel>
      <GradientPanelFooter>
        <View style={styles.panel}>
          <ExtendedPublicKey accountNumber={accountNumber} extendedPublicKey={loc.advancedAccountInfo.xpubHidden} />
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
});
