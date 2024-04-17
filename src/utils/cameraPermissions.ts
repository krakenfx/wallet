import { BarCodeScanner, PermissionStatus } from 'expo-barcode-scanner';
import { Alert, Linking } from 'react-native';

export const requestCameraPermission = async () => {
  const { status } = await BarCodeScanner.getPermissionsAsync();

  if (status === PermissionStatus.UNDETERMINED) {
    const result = await BarCodeScanner.requestPermissionsAsync();
    return result.status === PermissionStatus.GRANTED;
  }

  if (status === PermissionStatus.GRANTED) {
    return true;
  }

  if (status === PermissionStatus.DENIED) {
    return false;
  }
};

export const showPermissionDeniedAlert = () => {
  Alert.alert(
    'Permission Denied',
    'Please enable camera permissions in your device settings.',
    [
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
      { text: 'Cancel', style: 'cancel' },
    ],
    { cancelable: false },
  );
};
