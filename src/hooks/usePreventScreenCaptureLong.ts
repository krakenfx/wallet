import * as ScreenCapture from 'expo-screen-capture';
import { useEffect } from 'react';
import Config from 'react-native-config';

export const usePreventScreenCaptureLong = () => {
  useEffect(() => {
    if (!Config.DISABLE_SCREEN_CAPTURE) {
      ScreenCapture.preventScreenCaptureAsync();
      return () => {
        setTimeout(ScreenCapture.allowScreenCaptureAsync, 1000);
      };
    }
  }, []);
};
