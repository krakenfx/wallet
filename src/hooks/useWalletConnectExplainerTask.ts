import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { InteractionManager } from 'react-native';

import { RealmSettingsKey, useSettingsByKey, useSettingsMutations } from '@/realm/settings';
import { NavigationProps, Routes } from '@/Routes';

export const useWalletConnectExplainerTask = () => {
  const { setWalletConnectExplainerTaskCompleted } = useSettingsMutations();
  const taskCompleted = useSettingsByKey(RealmSettingsKey.walletConnectTaskCompleted);

  const navigation = useNavigation<NavigationProps<'Home'>['navigation']>();

  const runIfNeeded = useCallback(() => {
    if (taskCompleted) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      navigation.navigate(Routes.WalletConnectExplainer);
      setWalletConnectExplainerTaskCompleted();
    });
  }, [navigation, setWalletConnectExplainerTaskCompleted, taskCompleted]);

  return {
    runIfNeeded,
  };
};
