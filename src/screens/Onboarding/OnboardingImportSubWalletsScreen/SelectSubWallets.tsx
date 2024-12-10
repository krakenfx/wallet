import { useCallback, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { ImportSubWalletsButton } from './ImportSubWalletsButton';

import { SelectSubWalletsListItem } from './SelectSubWalletsListItem';

import type { SubWallet } from './OnboardingImportSubWalletsScreen.types';

type Props = { subWallets: SubWallet[] };

export const SelectSubWallets = ({ subWallets }: Props) => {
  const [selectedSubWallets, setSelectedSubWallets] = useState<SubWallet[]>(() => subWallets.filter(({ hasBalance, index }) => hasBalance || index === 0));
  const isImportSubWalletsButtonDisabled = selectedSubWallets.length < 1;

  const renderItem = useCallback(
    ({ item }: { item: SubWallet }) => {
      const toggleSubWallet = (subWallet: SubWallet) => {
        const isSelected = selectedSubWallets.findIndex(selectedSubWallet => selectedSubWallet.index === subWallet.index) >= 0;

        if (isSelected) {
          setSelectedSubWallets(selectedSubWallets.filter(selectedSubWallet => selectedSubWallet.index !== subWallet.index));
        } else {
          setSelectedSubWallets([...selectedSubWallets, subWallet]);
        }
      };

      const isSelected = selectedSubWallets.findIndex(selectedSubWallet => selectedSubWallet.index === item.index) >= 0;
      const toggleSubWallet_ = () => toggleSubWallet(item);

      return <SelectSubWalletsListItem subWallet={item} showSubWalletIndex={false} toggleSubWallet={toggleSubWallet_} isSelected={isSelected} />;
    },
    [selectedSubWallets],
  );

  return (
    <>
      <FlatList data={subWallets} contentContainerStyle={styles.list} keyExtractor={({ index }) => String(index)} renderItem={renderItem} />
      <ImportSubWalletsButton disabled={isImportSubWalletsButtonDisabled} selectedSubWallets={selectedSubWallets} />
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: 150,
  },
});
