import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { SvgIcon } from '@/components/SvgIcon';
import { Routes } from '@/Routes';
import { requestCameraPermission, showPermissionDeniedAlert } from '@/utils/cameraPermissions';
import { useIsOnline } from '@/utils/useConnectionManager';

export const HomeHeaderRight = () => {
  const navigation = useNavigation();
  const isOnline = useIsOnline();
  const onScanPress = useCallback(async () => {
    const canUseCamera = await requestCameraPermission();

    if (canUseCamera) {
      navigation.navigate(Routes.ConnectAppQRScan);
    } else {
      showPermissionDeniedAlert();
    }
  }, [navigation]);

  const onSettingsPress = useCallback(() => {
    navigation.navigate(Routes.Settings);
  }, [navigation]);

  const onLongPress = useCallback(() => {
    navigation.navigate(Routes.Debug);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SvgIcon
        name="scan-walletConnect"
        onPress={onScanPress}
        testID="ScanIcon"
        style={styles.gap}
        hitSlop={{ top: 16, bottom: 16, left: 0, right: 0 }}
        disabled={!isOnline}
      />
      <SvgIcon
        name="gear"
        onPress={onSettingsPress}
        onLongPress={onLongPress}
        testID="SettingsIcon"
        style={styles.settingsIcon}
        hitSlop={{ top: 16, bottom: 16, left: 0, right: 0 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    marginRight: 28 - 20,
  },
  gap: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  settingsIcon: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
});
