import { BottomSheetView, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { AuthenticationType } from 'expo-local-authentication';
import React, { useMemo } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { BottomSheetModal } from '@/components/BottomSheet';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';

import loc from '/loc';

export const MissingBiometricsSheet = React.forwardRef<BottomSheetModalRef, { authenticationTypes: AuthenticationType[] }>(({ authenticationTypes }, ref) => {
  const modal = useBottomSheetModal();

  const insets = useSafeAreaInsets();

  const data = useMemo(() => {
    if (!authenticationTypes.length || Platform.OS === 'android') {
      return {
        authType: loc.appLock.missingAuth.biometrics,
        list: [
          { image: require('@/assets/images/applock/system-android-settings.png'), label: loc.appLock.missingAuth.settings },
          { image: require('@/assets/images/applock/system-android-shield.png'), label: loc.appLock.missingAuth.tapSecurityPivacy },
          { image: require('@/assets/images/applock/system-android-warning.png'), label: loc.appLock.missingAuth.setupPin },
        ],
      };
    }

    return authenticationTypes[0] === AuthenticationType.FINGERPRINT
      ? {
          authType: loc.appLock.missingAuth.touchId,
          list: [
            { image: require('@/assets/images/applock/system-ios-settings.png'), label: loc.appLock.missingAuth.settings },
            { image: require('@/assets/images/applock/system-ios-touchid.png'), label: loc.appLock.missingAuth.tapTouchId },
            {
              image: require('@/assets/images/applock/system-ios-toggle.png'),
              label: loc.formatString(loc.appLock.missingAuth.turnOn, { authType: loc.appLock.missingAuth.touchId }),
            },
          ],
        }
      : {
          authType: loc.appLock.missingAuth.faceId,
          list: [
            { image: require('@/assets/images/applock/system-ios-settings.png'), label: loc.appLock.missingAuth.settings },
            { image: require('@/assets/images/applock/system-ios-faceid.png'), label: loc.appLock.missingAuth.tapFaceId },
            {
              image: require('@/assets/images/applock/system-ios-toggle.png'),
              label: loc.formatString(loc.appLock.missingAuth.turnOn, { authType: loc.appLock.missingAuth.faceId }),
            },
          ],
        };
  }, [authenticationTypes]);

  return (
    <BottomSheetModal ref={ref} index={0} enableDynamicSizing>
      <BottomSheetView style={[{ marginBottom: insets.bottom }]}>
        <View style={styles.container}>
          <Label type="boldDisplay4" style={styles.title}>
            {loc.formatString(loc.appLock.missingAuth.title, { authType: data.authType })}
          </Label>
          <Label type="regularTitle1" color="light75">
            {loc.formatString(loc.appLock.missingAuth.description, { authType: data.authType })}
          </Label>
          <View style={styles.list}>
            {data.list.map(item => (
              <View key={String(item.label)} style={styles.listItem}>
                <Image source={item.image} style={styles.icon} />
                <Label>{item.label}</Label>
              </View>
            ))}
          </View>
        </View>
        <FloatingBottomButtons
          noAbsolutePosition
          primary={{
            text: loc.appLock.missingAuth.ok,
            onPress: () => modal.dismiss(),
          }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  title: {
    lineHeight: 40,
    marginVertical: 8,
  },
  list: {
    paddingVertical: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  icon: {
    height: 36,
    width: 36,
    marginRight: 12,
  },
});
