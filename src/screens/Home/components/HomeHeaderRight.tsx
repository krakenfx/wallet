import { useNavigation } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-camera';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { SvgIcon } from '@/components/SvgIcon';
import { useIsWalletBackupDone } from '@/realm/settings/useIsWalletBackupDone';
import { Routes } from '@/Routes';
import { useTheme } from '@/theme/themes';
import { showPermissionDeniedAlert } from '@/utils/cameraPermissions';
import { useIsOnline } from '@/utils/useConnectionManager';

export const HomeHeaderRight = () => {
  const navigation = useNavigation();
  const isOnline = useIsOnline();
  const [_, requestPermission] = useCameraPermissions();

  const onScanPress = useCallback(async () => {
    const response = await requestPermission();

    if (response.granted) {
      navigation.navigate(Routes.ConnectAppQRScan);
    } else {
      showPermissionDeniedAlert();
    }
  }, [navigation, requestPermission]);

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
      <WalletBackupNeededBadge />
    </View>
  );
};

const WalletBackupNeededBadge = () => {
  const isWalletBackupNeeded = !useIsWalletBackupDone();
  const { colors } = useTheme();

  return isWalletBackupNeeded ? <View style={[styles.walletBackupNeededBadge, { backgroundColor: colors.red400 }]} /> : null;
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
  walletBackupNeededBadge: {
    height: 8,
    width: 8,
    borderRadius: 4,
    position: 'absolute',
    right: 2,
    top: 10,
  },
});
