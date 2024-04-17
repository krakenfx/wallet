import { useMemo } from 'react';
import * as RNLocalize from 'react-native-localize';

import { languages } from '../../../loc/languages';

import { RealmSettingsKey } from './schema';
import { useSettingsByKey } from './useSettingsByKey';

import { LanguageTag } from '/loc';

export const useLanguage = (): LanguageTag => {
  const settingsLanguage = useSettingsByKey(RealmSettingsKey.language);

  return useMemo(() => {
    const foundLangFromSettings = languages.find(lang => lang.tag === settingsLanguage);
    if (foundLangFromSettings) {
      console.log(`[useLanguage] using settings locale: ${foundLangFromSettings.tag}`);
      return foundLangFromSettings.tag;
    }

    const deviceLocale = RNLocalize.getLocales()[0];
    const matchingDeviceLocale = languages.find(lang => lang.tag === deviceLocale.languageTag);
    if (matchingDeviceLocale) {
      console.log(`[useLanguage] using device locale: ${matchingDeviceLocale.tag}`);
      return matchingDeviceLocale.tag;
    }
    console.log('[useLanguage] using default languege: en-US');
    return 'en-US';
  }, [settingsLanguage]);
};
