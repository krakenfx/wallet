import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

import loc from '/loc';

type Props = { subWalletsCount: number };

export const ImportSubWalletsHeader = ({ subWalletsCount }: Props) => (
  <View style={styles.header}>
    <Label type="boldDisplay5">{loc.onboardingImportSubWallets.importSubWallets.title}</Label>
    <Label type="regularBody">
      {subWalletsCount === 1
        ? loc.onboardingImportSubWallets.importSubWallets.subtitleOneWallet
        : loc.formatString(loc.onboardingImportSubWallets.importSubWallets.subtitle, { subWalletsCount })}
    </Label>
  </View>
);

const styles = StyleSheet.create({
  header: {
    gap: 8,
    paddingHorizontal: 24,
  },
});
