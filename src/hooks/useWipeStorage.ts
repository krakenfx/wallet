import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { useSecuredRealmContext } from '@/realm/SecuredRealmProvider';
import { Routes } from '@/Routes';
import { clearAppData } from '@/utils/clearAppData';

export const useWipeStorage = () => {
  const { wipeEncryptionKey } = useSecuredRealmContext();
  const { reset } = useNavigation();

  const wipeStorage = useCallback(async () => {
    await clearAppData();
    reset({ index: 0, routes: [{ name: Routes.Onboarding }] });
    await wipeEncryptionKey();
  }, [reset, wipeEncryptionKey]);

  return { wipeStorage };
};
