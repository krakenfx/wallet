import { useEffect } from 'react';

import { PromptSheet } from '@/components/Sheets';
import { useSettingsMutations } from '@/realm/settings';
import { navigationStyle } from '@/utils/navigationStyle';

import { WalletBackupPrompt } from './components/WalletBackupPrompt';

export const WalletBackupPromptScreen = () => {
  const { setHasViewedWalletBackupPrompt } = useSettingsMutations();

  useEffect(function setSettingHasViewedWalletBackupPrompt() {
    setHasViewedWalletBackupPrompt(true);
  });

  return (
    <PromptSheet>
      <WalletBackupPrompt />
    </PromptSheet>
  );
};

WalletBackupPromptScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'transparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
