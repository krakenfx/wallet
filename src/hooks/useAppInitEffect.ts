import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';

import { RealmSettingsKey, useSettingsByKey, useSettingsMutations } from '@/realm/settings';
import { useTokenPriceHistoryMutations } from '@/realm/tokenPrice';

export const useAppInitEffect = (callback: (appInitCounter: number) => void) => {
  const hasRunOnce = useRef(false);
  const appOpenedCount = useSettingsByKey(RealmSettingsKey.appOpenedCounter) ?? 1;
  const { removeAllPriceHistory } = useTokenPriceHistoryMutations();
  const { setSettings } = useSettingsMutations();

  useFocusEffect(
    useCallback(() => {
      if (hasRunOnce.current) {
        return;
      }
      hasRunOnce.current = true;
      callback(appOpenedCount);
      setSettings(RealmSettingsKey.appOpenedCounter, appOpenedCount + 1);
    }, [appOpenedCount, callback, setSettings]),
  );

  useEffect(() => {
    removeAllPriceHistory();
  }, [removeAllPriceHistory]);
};
