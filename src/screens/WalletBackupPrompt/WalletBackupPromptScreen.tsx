import React, { useEffect, useRef } from 'react';

import { BottomSheetRef } from '@/components/BottomSheet';
import navigationStyle from '@/components/navigationStyle';
import { PromptSheet } from '@/components/Sheets';
import { useSettingsMutations } from '@/realm/settings';

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
