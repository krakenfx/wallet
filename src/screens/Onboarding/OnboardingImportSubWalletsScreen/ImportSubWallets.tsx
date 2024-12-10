import { StyleSheet, View } from 'react-native';

import { ImportSubWalletsHeader } from './ImportSubWalletsHeader';

import { SelectSubWallets } from './SelectSubWallets';
import { SelectSubWalletsHeader } from './SelectSubWalletsHeader';

import type { SubWallet } from './OnboardingImportSubWalletsScreen.types';

type Props = { subWallets: SubWallet[] };

export const ImportSubWallets = ({ subWallets }: Props) => {
  return (
    <View style={styles.container}>
      <ImportSubWalletsHeader subWalletsWithBalanceCount={subWallets.filter(({ hasBalance }) => hasBalance).length} />
      <View style={styles.body}>
        <SelectSubWalletsHeader subWalletsCount={subWallets.length} />
        <SelectSubWallets subWallets={subWallets} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    gap: 40,
  },
  body: {
    flex: 1,
  },
});
