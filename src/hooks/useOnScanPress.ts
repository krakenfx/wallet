import { useNavigation } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-camera';

import { useCallback } from 'react';

import { Routes } from '@/Routes';
import { showPermissionDeniedAlert } from '@/utils/cameraPermissions';

export const useOnScanPress = () => {
  const navigation = useNavigation();
  const [_, requestPermission] = useCameraPermissions();
  const onScanPress = useCallback(async () => {
    const response = await requestPermission();

    if (response.granted) {
      navigation.navigate(Routes.ConnectAppQRScan);
    } else {
      showPermissionDeniedAlert();
    }
  }, [navigation, requestPermission]);

  return onScanPress;
};
