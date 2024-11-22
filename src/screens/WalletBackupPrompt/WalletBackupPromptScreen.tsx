import { useEffect, useRef } from 'react';

import type { BottomSheetRef } from '@/components/BottomSheet';
import { PromptSheet } from '@/components/Sheets';
import { useSettingsMutations } from '@/realm/settings';
import { navigationStyle } from '@/utils/navigationStyle';

import { WalletBackupPrompt } from './components/WalletBackupPrompt';

export const WalletBackupPromptScreen = () => {
  const sheetRef = useRef<BottomSheetRef>(null);
  const { setHasViewedWalletBackupPrompt } = useSettingsMutations();

  useEffect(function setSettingHasViewedWalletBackupPrompt() {
    setHasViewedWalletBackupPrompt(true);
  });

  return <PromptSheet Prompt={({ onLayout }) => <WalletBackupPrompt containerProps={{ onLayout }} />} sheetRef={sheetRef} />;
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
