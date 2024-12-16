import { Platform } from 'react-native';

export const getOSMajorVersionNumber = (): number => {
  if (Platform.OS === 'android') {
    return Platform.Version;
  }
  const [major] = String(Platform.Version).split('.').map(Number);
  return major;
};
