import { useNavigation } from '@react-navigation/native';

import { Linking } from 'react-native';
import { WebViewProps } from 'react-native-webview';

import { Routes } from '@/Routes';
import { BrowserParams } from '@/screens/Browser';
import { isInAppBrowserEnabled } from '@/utils/featureFlags';

interface Options extends WebViewProps, Omit<BrowserParams, 'url'> {}

export type OpenURL = (url: string, options?: Options) => void;

export const useBrowser = () => {
  const navigation = useNavigation();

  const openURL: OpenURL = (url, options = {}) => {
    if (!isInAppBrowserEnabled()) {
      Linking.openURL(url);
      return;
    }

    navigation.navigate(Routes.Browser, { ...options, url });
  };

  const openWithoutURL = (options: Options = {}) => {
    navigation.navigate(Routes.Browser, { ...options });
  };

  return {
    openURL,
    openWithoutURL,
  };
};
