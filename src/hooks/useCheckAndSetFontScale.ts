import { useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';

import { RealmSettingsKey, useSettingsMutations } from '@/realm/settings';
import { useDeviceFontScale } from '@/realm/settings/useDeviceFontScale';

export const useCheckAndSetFontScale = () => {
  const { setSettings } = useSettingsMutations();
  const currentScale = useDeviceFontScale();

  useEffect(() => {
    const checkFontScale = async () => {
      const scale = await DeviceInfo.getFontScale();
      if (scale !== currentScale) {
        setSettings(RealmSettingsKey.deviceFontScale, scale);
      }
    };
    checkFontScale();
  }, [currentScale, setSettings]);
};
