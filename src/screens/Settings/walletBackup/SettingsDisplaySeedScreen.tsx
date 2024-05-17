import React from 'react';
import { StyleSheet } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import navigationStyle from '@/components/navigationStyle';
import { SeedDisplay } from '@/components/SeedDisplay';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';

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
