import { useCallback } from 'react';
import Config from 'react-native-config';
import Realm from 'realm';

import { type FeatureFlag, type FeatureFlags, REALM_TYPE_FEATURE_FLAGS } from '@/unencrypted-realm/featureFlags/schema';
import { useUnencryptedObject, useUnencryptedRealm } from '@/unencrypted-realm/RealmContext';

const FEATURE_FLAGS_ENABLED = __DEV__ || Config.INTERNAL_RELEASE;

export const useFeatureFlag = (name: keyof FeatureFlags) => {
  const realm = useUnencryptedRealm();
  const featureFlag = useUnencryptedObject<FeatureFlag>(REALM_TYPE_FEATURE_FLAGS, name, 'name');

  const setFeatureFlag = useCallback(
    (state: boolean) => {
      realm.write(() => {
        realm.create<FeatureFlag>(
          REALM_TYPE_FEATURE_FLAGS,
          {
            name,
            value: state,
          },
          Realm.UpdateMode.All,
        );
      });
    },
    [realm, name],
  );

  if (!FEATURE_FLAGS_ENABLED || !featureFlag) {
    return [false, setFeatureFlag] as const;
  }

  return [featureFlag.value, setFeatureFlag] as const;
};
