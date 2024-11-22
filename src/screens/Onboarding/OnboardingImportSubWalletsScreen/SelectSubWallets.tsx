import { useCallback, useState } from 'react';
import { FlatList } from 'react-native';

import { ImportSubWalletsButton } from './ImportSubWalletsButton';

import { SelectSubWalletsHeader } from './SelectSubWalletsHeader';
import { SelectSubWalletsListItem } from './SelectSubWalletsListItem';

import type { SubWallet } from './OnboardingImportSubWalletsScreen.types';

type Props = { subWallets: SubWallet[] };

export const SelectSubWallets = ({ subWallets }: Props) => {
  const [selectedSubWallets, setSelectedSubWallets] = useState<SubWallet[]>([]);
  const isImportSubWalletsButtonDisabled = selectedSubWallets.length < 1;

  const renderItem = useCallback(
    ({ item }: { item: SubWallet }) => {
      const toggleSubWallet = (subWallet: SubWallet) => {
        const isSelected = selectedSubWallets.findIndex(selectedSubWallet => selectedSubWallet.id === subWallet.id) >= 0;

        if (isSelected) {
          setSelectedSubWallets(selectedSubWallets.filter(selectedSubWallet => selectedSubWallet.id !== subWallet.id));
        } else {
          setSelectedSubWallets([...selectedSubWallets, subWallet]);
        }
      };

      const isSelected = selectedSubWallets.findIndex(selectedSubWallet => selectedSubWallet.id === item.id) >= 0;
      const toggleSubWallet_ = () => toggleSubWallet(item);

      return <SelectSubWalletsListItem subWalletId={item.id} toggleSubWallet={toggleSubWallet_} isSelected={isSelected} />;
    },
    [selectedSubWallets],
  );

  return (
    <>
      <FlatList
        data={subWallets}
        keyExtractor={({ id }) => String(id)}
        renderItem={renderItem}
        ListHeaderComponent={<SelectSubWalletsHeader subWalletsCount={subWallets.length} />}
      />
      <ImportSubWalletsButton disabled={isImportSubWalletsButtonDisabled} selectedSubWallets={selectedSubWallets} />
    </>
  );
};
