import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

import loc from '/loc';

type Props = { subWalletsCount: number };

export const SelectSubWalletsHeader = ({ subWalletsCount }: Props) => {
  return (
    <View style={styles.header}>
      <Label type="boldTitle2">
        {subWalletsCount === 1
          ? loc.onboardingImportSubWallets.importSubWallets.walletsFoundOne
          : loc.formatString(loc.onboardingImportSubWallets.importSubWallets.walletsFound, { subWalletsCount })}
      </Label>
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
    minHeight: 34,
  },
});
