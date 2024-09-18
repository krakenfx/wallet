import { useCallback, useEffect } from 'react';

import { InteractionManager } from 'react-native';

import { PushNotifications } from '@/api/PushNotifications';
import { useGetSubscribeNotifications } from '@/hooks/useGetSubscribeNotifications';
import { useLanguage } from '@/realm/settings';

import { handleError } from '/helpers/errorHandler';

export const usePushNotificationsRegisterRemoteNotification = () => {
  const { subscribeToNotifications } = useGetSubscribeNotifications();
  const language = useLanguage();

  const resubscribe = useCallback(async () => {
    try {
      const instance = PushNotifications.getInstance();
      if (await instance.getDeviceToken()) {
        if (await instance.hasPermission()) {
          
          
          await instance.registerRemoteNotifications();
          await subscribeToNotifications(); 
          await instance.saveTokenConfiguration();
        } else {
          
          console.log('No push permission after it was already granted, remove token for clear state');
          PushNotifications.getInstance().clearToken();
        }
      }
    } catch (error) {
      handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
    }
  }, [subscribeToNotifications]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      resubscribe();
    });
  }, [language, resubscribe]);
};
