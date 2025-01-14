import type { ReactElement } from 'react';

import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

import loc from '/loc';

type Props = { subWalletsCount: number; button: ReactElement };

export const SelectSubWalletsHeader = ({ subWalletsCount, button }: Props) => {
  return (
    <View style={styles.header}>
      <Label type="boldTitle2">
        {subWalletsCount === 1
          ? loc.onboardingImportSubWallets.importSubWallets.walletsFoundOne
          : loc.formatString(loc.onboardingImportSubWallets.importSubWallets.walletsFound, { subWalletsCount })}
      </Label>
      {button}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingRight: 16,
    paddingBottom: 6,
    paddingLeft: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 34,
  },
});
