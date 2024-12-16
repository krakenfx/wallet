import { useNavigation } from '@react-navigation/native';

import { Routes } from '@/Routes';
import type { BrowserParams } from '@/screens/Browser';

import type { WebViewProps } from '@metamask/react-native-webview';

interface Options extends WebViewProps, Omit<BrowserParams, 'url'> {}

export type OpenURL = (url: string, options?: Options) => void;

export const useBrowser = () => {
  const navigation = useNavigation();

  const openURL: OpenURL = (url, options = {}) => {
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
