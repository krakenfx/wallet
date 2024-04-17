import { useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef } from 'react';

import { PushNotifications } from '@/api/PushNotifications';
import { BottomSheet, BottomSheetRef } from '@/components/BottomSheet';

import navigationStyle from '@/components/navigationStyle';
import { PushNotificationPrompt } from '@/components/PushNotificationPrompt';
import { useSettingsMutations } from '@/realm/settings';
import { NavigationProps } from '@/Routes';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

export type TriggeredPushPromptParams = {
  transactionIds?: string[];
};

export const TriggeredPushPromptScreen = ({ navigation, route: { params } }: NavigationProps<'TriggeredPushPrompt'>) => {
  const ref = useRef<BottomSheetRef>(null);

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const { setPushPromptNeeded } = useSettingsMutations();

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const close = () => {
    setPushPromptNeeded(false);
    ref.current?.close();
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
    close();
  };

  const onError = (error: unknown, permissionDenied: boolean) => {
    if (permissionDenied) {
      close();
    } else {
      handleError(error, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    }
  };

  return (
    <BottomSheet
      ref={ref}
      animateOnMount
      onClose={navigation.goBack}
      contentHeight={animatedContentHeight}
      handleHeight={animatedHandleHeight}
      snapPoints={animatedSnapPoints}>
      <PushNotificationPrompt
        containerProps={{ onLayout: handleContentLayout }}
        onDisallow={close}
        onError={onError}
        onSubscribed={onSubscribed}
        allowButtonText={loc.pushNotificationsPrompt.allow}
        disallowButtonText={loc.pushNotificationsPrompt.disallow}
      />
    </BottomSheet>
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
