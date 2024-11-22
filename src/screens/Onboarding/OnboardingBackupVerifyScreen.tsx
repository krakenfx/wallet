import { GradientScreenView } from '@/components/Gradients';

import { useWalletBackupSettings } from '@/hooks/useWalletBackupSettings';
import { Routes } from '@/Routes';
import { WalletBackupVerify } from '@/screens/Settings/walletBackup';
import { navigationStyle } from '@/utils/navigationStyle';

import type { OnboardingNavigationProps } from './OnboardingRouter';

export const OnboardingBackupVerifyScreen = ({ navigation }: OnboardingNavigationProps<'OnboardingBackupVerify'>) => {
  const { isCloudBackupSuggested } = useWalletBackupSettings();

  const handleVerifySuccess = () => {
    if (isCloudBackupSuggested) {
      navigation.navigate(Routes.OnboardingBackupPrompt);
    } else {
      navigation.navigate(Routes.OnboardingSecureWallet);
    }
  };

  return (
    <GradientScreenView>
      <WalletBackupVerify onVerifySuccess={handleVerifySuccess} />
    </GradientScreenView>
  );
};

OnboardingBackupVerifyScreen.navigationOptions = navigationStyle({
  title: '',
  headerTransparent: true,
});
