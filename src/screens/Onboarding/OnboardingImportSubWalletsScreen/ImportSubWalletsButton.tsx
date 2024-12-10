import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { useManageAccount } from '@/hooks/useManageAccount';
import { Routes } from '@/Routes';

import type { SubWallet } from './OnboardingImportSubWalletsScreen.types';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

type Props = { selectedSubWallets: SubWallet[]; disabled?: boolean };

export const ImportSubWalletsButton = ({ disabled, selectedSubWallets }: Props) => {
  const selectedSubWalletsCount = selectedSubWallets.length;
  const navigation = useNavigation();
  const { createAccounts, switchAccount } = useManageAccount();
  const [isImportingSubWallets, setIsImportingSubWallets] = useState(false);
  const hasAttemptedImportingSubWallets = useRef(false);

  const onPress = async () => {
    if (!isImportingSubWallets && !hasAttemptedImportingSubWallets.current) {
      hasAttemptedImportingSubWallets.current = true;
      setIsImportingSubWallets(true);

      const accountIndexes = selectedSubWallets.filter(({ index }) => index !== 0).map(({ index }) => index);
      const success = accountIndexes.length > 0 ? await createAccounts(accountIndexes) : true;

      switchAccount(0);

      setIsImportingSubWallets(false);

      if (success) {
        navigation.navigate(Routes.OnboardingImportSubWalletsSuccess, { subWalletIndexes: selectedSubWallets.map(subWallet => subWallet.index) });
      } else {
        handleError('Import wallets failure', 'ERROR_CONTEXT_PLACEHOLDER');

        navigation.navigate(Routes.OnboardingSecureWallet);
      }
    }
  };

  return (
    <FloatingBottomButtons
      primary={{
        disabled,
        loading: isImportingSubWallets,
        onPress,
        loadingText:
          selectedSubWalletsCount === 1
            ? loc.onboardingImportSubWallets.importSubWallets.importingWalletsOne
            : loc.formatString(loc.onboardingImportSubWallets.importSubWallets.importingWallets, { subWalletsCount: selectedSubWalletsCount }).toString(),
        text:
          selectedSubWalletsCount === 1
            ? loc.onboardingImportSubWallets.importSubWallets.importWalletsOne
            : loc.formatString(loc.onboardingImportSubWallets.importSubWallets.importWallets, { subWalletsCount: selectedSubWalletsCount }).toString(),
      }}
    />
  );
};
