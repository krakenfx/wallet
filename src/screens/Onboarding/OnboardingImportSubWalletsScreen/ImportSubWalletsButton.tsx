import { useNavigation } from '@react-navigation/native';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Routes } from '@/Routes';

import type { SubWallet } from './OnboardingImportSubWalletsScreen.types';

import loc from '/loc';

type Props = { selectedSubWallets: SubWallet[]; disabled?: boolean };

export const ImportSubWalletsButton = ({ disabled, selectedSubWallets }: Props) => {
  const selectedSubWalletsCount = selectedSubWallets.length;
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate(Routes.OnboardingImportSubWalletsSuccess, { subWalletIds: selectedSubWallets.map(subWallet => subWallet.id) });
  };

  return (
    <FloatingBottomButtons
      primary={{
        disabled,
        onPress,
        text:
          selectedSubWalletsCount === 1
            ? loc.onboardingImportSubWallets.importSubWallets.importWalletsOne
            : loc.formatString(loc.onboardingImportSubWallets.importSubWallets.importWallets, { subWalletsCount: selectedSubWalletsCount }).toString(),
      }}
    />
  );
};
