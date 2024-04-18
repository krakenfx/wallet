import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GradientPanelFooter, GradientPanelHeader } from '@/components/GradientPanel';
import { Label } from '@/components/Label';
import { TokenIcon } from '@/components/TokenIcon';

import { DerivationPath } from './DerivationPath';

export const PoktPanel = ({ derivationPath }: { derivationPath: string }) => {
  return (
    <View>
      <GradientPanelHeader>
        <View style={styles.panelHeader}>
          <TokenIcon networkName="pocket" forceOmitNetworkIcon />
          <Label type="boldTitle2">Pocket Network</Label>
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
});