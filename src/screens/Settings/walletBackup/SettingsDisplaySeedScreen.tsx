import React from 'react';
import { StyleSheet } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import { SeedDisplay } from '@/components/SeedDisplay';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { navigationStyle } from '@/utils/navigationStyle';

import loc from '/loc';

export const SettingsDisplaySeedScreen = () => {
  useHeaderTitle(loc.walletBackup.secretRecoveryPhrase);

  return (
    <GradientScreenView>
      <SeedDisplay style={styles.seedDisplay} />
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  seedDisplay: {
    marginTop: 12,
  },
});

SettingsDisplaySeedScreen.navigationOptions = navigationStyle({ title: loc.walletBackup.secretRecoveryPhrase, headerTransparent: true });
