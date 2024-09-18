import { Platform } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';

export const hideSplashScreen = () => {
  
  setTimeout(() => {
    RNBootSplash.hide({ fade: true, duration: 400 });
  }, Platform.select({ ios: 500 }));
};
