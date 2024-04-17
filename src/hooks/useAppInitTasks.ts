import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useRef } from 'react';

import { useRealm } from '@/realm/RealmContext';
import { RealmSettingsKey, useSettingsMutations } from '@/realm/settings';
import { getSettingsByKey } from '@/realm/settings/getSettingsByKey';
import { NavigationProps, Routes } from '@/Routes';

export const useAppInitTasks = () => {
  const { setWalletConnectExplainerNeeded } = useSettingsMutations();
  const hasRunOnce = useRef(false);
  const navigation = useNavigation<NavigationProps<'Home'>['navigation']>();
  const realm = useRealm();

  const checkWallectConnectExplainerTask = useCallback(() => {
    const isExplainerNeeded = getSettingsByKey(realm, RealmSettingsKey.walletConnectExplainerNeeded);

    switch (isExplainerNeeded) {
      case undefined: {
        setWalletConnectExplainerNeeded(true);
        break;
      }
      case true: {
        setTimeout(() => {
          navigation.navigate(Routes.WalletConnectExplainer);
        }, 1000);
        break;
      }
    }
  }, [navigation, realm, setWalletConnectExplainerNeeded]);

  useFocusEffect(
    useCallback(() => {
      if (hasRunOnce.current) {
        return;
      }
      hasRunOnce.current = true;
      checkWallectConnectExplainerTask();
    }, [checkWallectConnectExplainerTask]),
  );
};
