import React, { useRef } from 'react';

import { PushNotifications } from '@/api/PushNotifications';
import { BottomSheetRef } from '@/components/BottomSheet';
import { PushNotificationPrompt } from '@/components/PushNotificationPrompt';
import { PromptSheet } from '@/components/Sheets';
import { useSettingsMutations } from '@/realm/settings';
import { NavigationProps } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export type TriggeredPushPromptParams = {
  transactionIds?: string[];
};

export const TriggeredPushPromptScreen = ({ route: { params } }: NavigationProps<'TriggeredPushPrompt'>) => {
  const sheetRef = useRef<BottomSheetRef>(null);
  const { setPushPromptNeeded } = useSettingsMutations();

  const close = () => {
    setPushPromptNeeded(false);
    sheetRef.current?.close();
  };

  const onSubscribed = async () => {
    if (params?.transactionIds) {
      const pushInstance = PushNotifications.getInstance();
      try {
        if (await pushInstance.getDeviceToken()) {
          await pushInstance.subscribeTransactionsToPushNotifications(params.transactionIds);
        }
      } catch (error) {
        handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
      }
    }
  };

  const onError = (error: unknown, permissionDenied?: boolean) => {
    if (permissionDenied) {
      close();
    } else {
      handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    }
  };

  return (
    <PromptSheet
      Prompt={({ onLayout }) => (
        <PushNotificationPrompt
          containerProps={{ onLayout }}
          onDisallow={close}
          onAllow={close}
          onError={onError}
          onSubscribed={onSubscribed}
          allowButtonText={loc.pushNotificationsPrompt.allow}
          disallowButtonText={loc.pushNotificationsPrompt.disallow}
        />
      )}
      sheetRef={sheetRef}
    />
  );
};

TriggeredPushPromptScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'transparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
