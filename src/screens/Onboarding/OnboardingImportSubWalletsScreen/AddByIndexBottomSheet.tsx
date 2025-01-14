import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActivityIndicator } from '@/components/ActivityIndicator';
import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { BottomSheet } from '@/components/BottomSheet';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { KeyboardAvoider } from '@/components/Keyboard';
import { Label } from '@/components/Label';
import { SearchInput } from '@/components/SearchInput';
import { useCommonSnapPoints } from '@/hooks/useCommonSnapPoints';
import { useDebounceEffect } from '@/hooks/useDebounceEffect';

import { SelectSubWalletsListItem } from './SelectSubWalletsListItem';
import { useFetchSubWalletByAccount } from './useFetchSubWallets';

import type { SubWallet } from './OnboardingImportSubWalletsScreen.types';

import loc from '/loc';

type Props = { onDismiss: () => void; setSubWalletsFromAddByIndex: React.Dispatch<React.SetStateAction<SubWallet[]>> };

export const AddByIndexBottomSheet = ({ onDismiss, setSubWalletsFromAddByIndex }: Props) => {
  const snapPoints = useCommonSnapPoints('toHeaderTransparent');
  const bottomSheetRef = useRef<BottomSheetModalRef>(null);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchInputValueDebounced, setSearchInputValueDebounced] = useState('');
  const [selectedSubWallet, setSelectedSubWallet] = useState<SubWallet | null>(null);
  const { subWallet, isLoading } = useFetchSubWalletByAccount(searchInputValueDebounced);

  const onDismiss_ = useCallback(() => {
    onDismiss();
    setSearchInputValue('');
    setSelectedSubWallet(null);
  }, [onDismiss]);
  const onChangeText = useCallback((text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');

    setSearchInputValue(numericText);
    if (numericText === '') {
      setSelectedSubWallet(null);
    }
  }, []);
  const onToggleSubWallet = () => {
    if (subWallet) {
      const isSelected = selectedSubWallet?.index === subWallet.index;

      setSelectedSubWallet(isSelected ? null : subWallet);
    }
  };
  const onAddWallets = () => {
    if (selectedSubWallet) {
      setSubWalletsFromAddByIndex(prevSubWalletsFromAddByIndex => {
        return prevSubWalletsFromAddByIndex.some(prevSubWalletFromAddByIndex => prevSubWalletFromAddByIndex.index === selectedSubWallet.index)
          ? prevSubWalletsFromAddByIndex
          : [...prevSubWalletsFromAddByIndex, selectedSubWallet];
      });
    }
    onDismiss_();
    bottomSheetRef.current?.close?.();
  };
  const isSelected = subWallet && selectedSubWallet ? selectedSubWallet.index === subWallet.index : false;
  const hasSearchTerm = searchInputValue !== '';

  useDebounceEffect(
    () => {
      setSearchInputValueDebounced(searchInputValue);
    },
    [searchInputValue],
    300,
  );

  return (
    <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} index={0} onDismiss={onDismiss_} animateOnMount dismissible noSafeInsetTop noBackdrop>
      <KeyboardAvoider style={styles.keyboardAvoider}>
        <View style={styles.header}>
          <Label type="boldDisplay5">{loc.onboardingImportSubWallets.addByIndex.title}</Label>
          <Label type="regularBody" color="light75">
            {loc.onboardingImportSubWallets.addByIndex.description}
          </Label>
        </View>
        <View style={styles.searchInput}>
          <SearchInput
            autoFocus
            keyboardType="numeric"
            omitIcon
            onChangeText={onChangeText}
            placeholder={loc.onboardingImportSubWallets.addByIndex.placeholder}
            value={searchInputValue}
          />
        </View>
        <View style={styles.searchResults}>
          {isLoading && hasSearchTerm ? (
            <ActivityIndicator style={styles.activityIndicator} />
          ) : subWallet && hasSearchTerm ? (
            <SelectSubWalletsListItem
              subWallet={subWallet}
              isSelected={isSelected}
              showSubWalletIndex="compact"
              toggleSubWallet={onToggleSubWallet}
              backgroundGradient
            />
          ) : null}
        </View>

        <FloatingBottomButtons
          primary={{
            onPress: onAddWallets,
            disabled: !selectedSubWallet,
            text: loc.onboardingImportSubWallets.addByIndex.addWallet,
          }}
          avoidKeyboard
        />
      </KeyboardAvoider>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 12,
  },
  keyboardAvoider: {
    flex: 1,
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchResults: {
    marginTop: 12,
    marginBottom: 48,
  },
  activityIndicator: {
    alignSelf: 'center',
    marginTop: 60,
  },
});
