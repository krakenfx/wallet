import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AddByIndexBottomSheet } from './AddByIndexBottomSheet';
import { AddByIndexButton } from './AddByIndexButton';
import { ImportSubWalletsHeader } from './ImportSubWalletsHeader';
import { SelectSubWallets } from './SelectSubWallets';
import { SelectSubWalletsHeader } from './SelectSubWalletsHeader';

import type { SubWallet } from './OnboardingImportSubWalletsScreen.types';

type Props = { subWallets: SubWallet[] };

export const ImportSubWallets = ({ subWallets }: Props) => {
  const [subWalletsFromAddByIndex, setSubWalletsFromAddByIndex] = useState<SubWallet[]>([]);
  const [openAddByIndex, setOpenAddByIndex] = useState(false);

  const onPress = useCallback(() => setOpenAddByIndex(true), []);
  const onDismiss = useCallback(() => setOpenAddByIndex(false), []);
  const subWalletsUnique = sortBy(uniqBy([...subWallets, ...subWalletsFromAddByIndex], 'index'), [subWallet => subWallet.index]);

  return (
    <>
      <View style={styles.container}>
        <ImportSubWalletsHeader subWalletsWithBalanceCount={subWalletsUnique.filter(({ hasBalance }) => hasBalance).length} />
        <View style={styles.body}>
          <SelectSubWalletsHeader subWalletsCount={subWalletsUnique.length} button={<AddByIndexButton onPress={onPress} />} />
          <SelectSubWallets subWallets={subWalletsUnique} subWalletsFromAddByIndex={subWalletsFromAddByIndex} />
        </View>
      </View>
      {openAddByIndex && <AddByIndexBottomSheet onDismiss={onDismiss} setSubWalletsFromAddByIndex={setSubWalletsFromAddByIndex} />}
    </>
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
