import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import LottieView from 'lottie-react-native';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { SequencedTransition } from 'react-native-reanimated';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { ERROR_CODE, PushNotifications } from '@/api/PushNotifications';
import lottieSource from '@/assets/lottie/pushNotificationModalAnimation.json';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { useGetSubscribeNotifications } from '@/hooks/useGetSubscribeNotifications';

import loc from '/loc';

export interface Props {
  allowButtonText: string;
  disallowButtonText: string;
  onAllow: () => void;
  onSubscribed?: () => void;
  onError: (error: unknown, permissionDenied?: boolean) => void;
  onDisallow: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  containerProps?: ViewProps;
}

export const PushNotificationPrompt: React.FC<Props> = ({
  allowButtonText,
  disallowButtonText,
  onError,
  onSubscribed,
  onAllow,
  onDisallow,
  containerStyle,
  containerProps,
}) => {
  const { subscribeToNotifications } = useGetSubscribeNotifications();

  const subscribe = useCallback(async () => {
    const pn = PushNotifications.getInstance();
    try {
      
      await pn.requestPermissions();
      onAllow();
    } catch (error) {
      onError(error, error instanceof Error && error.message === ERROR_CODE.PERMISSION_DENIED);
      return;
    }
    try {
      await pn.registerRemoteNotifications();
      await pn.saveTokenConfiguration();
      await subscribeToNotifications(); 
      onSubscribed?.();
    } catch (error) {
      onError(error);
    }
  }, [onAllow, onError, onSubscribed, subscribeToNotifications]);

  const { width } = useSafeAreaFrame();

  const lottieHeight = (width * lottieSource.h) / lottieSource.w;

  return (
    <View style={[styles.container, containerStyle]} testID="PushNotificationsPromptScreen" {...containerProps}>
      <LottieView source={lottieSource} autoPlay loop={false} style={[styles.lottie, { height: lottieHeight }]} resizeMode="cover" />
      <View style={styles.body}>
        <Label type="boldDisplay3">{loc.pushNotificationsPrompt.title}</Label>
        <Label type="regularTitle1" color="light75">
          {loc.pushNotificationsPrompt.content}
        </Label>
      </View>

      <FloatingBottomButtons
        noAbsolutePosition
        style={styles.buttonContainer}
        primary={{
          text: allowButtonText,
          onPress: subscribe,
          testID: 'PushNotificationsPromptAllowButton',
          layout: SequencedTransition.duration(1000),
        }}
        secondary={{
          text: disallowButtonText,
          onPress: onDisallow,
          testID: 'PushNotificationsPromptDisallowButton',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    gap: 8,
    paddingHorizontal: 24,
    marginTop: -12,
  },
  lottie: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 70,
    justifyContent: 'center',
  },
  buttonLoadingStyle: {
    flex: 0,
    width: 64,
  },
});
