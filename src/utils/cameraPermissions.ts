import { Alert, Linking } from 'react-native';

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
