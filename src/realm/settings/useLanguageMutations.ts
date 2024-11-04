import { useCallback } from 'react';
import Realm from 'realm';

import { useRealm } from '../RealmContext';

import { REALM_TYPE_SETTINGS, RealmSettingsKey } from './schema';

import type { RealmSettings } from './schema';

import type { LanguageTag } from '/loc';
import { saveLanguage } from '/loc';

export const useLanguageSetMutation = () => {
  const realm = useRealm();

  const setLanguage = useCallback(
    (newTag: LanguageTag) => {
      realm.write(() => {
        realm.create<RealmSettings>(
          REALM_TYPE_SETTINGS,
          {
            name: RealmSettingsKey.language,
            value: newTag,
          },
          Realm.UpdateMode.Modified,
        );
        saveLanguage(newTag);
      });
    },
    [realm],
  );

  return {
    setLanguage,
  };
};
