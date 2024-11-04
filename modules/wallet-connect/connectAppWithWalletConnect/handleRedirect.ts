import { Linking, NativeModules, Platform } from 'react-native';

import { showToast } from '@/components/Toast';

import type { SessionTypes } from '@walletconnect/types';

import loc from '/loc';

const toast = (name: string, toastType: 'request_fulfilled' | 'connected_to', sessionIsDeepLinked: boolean) => {
  if (toastType === 'connected_to') {
    showToast({
      type: 'success',
      icon: 'plug-connected',
      text: loc.formatString(loc.scan.connected_to, { appName: name ?? '' }).toString(),
    });
  } else if (toastType === 'request_fulfilled') {
    showToast({
      type: 'success',
      icon: 'plug-connected',
      text: loc.formatString(loc.walletConnect.request_fulfilled).toString(),
    });
  }

  showToast({
    type: 'success',
    icon: 'check-circle',
    text: loc.formatString(loc.walletConnect.back_to_dapp).toString(),
    duration: 5000,
  });

  if (Platform.OS === 'android' && sessionIsDeepLinked) {
    NativeModules.Minimizer.goBack();
  }
};

export const handleRedirect = async (session: SessionTypes.Struct, toastType: 'request_fulfilled' | 'connected_to', sessionIsDeepLinked: boolean) => {
  try {
    if (session.peer.metadata.redirect?.native) {
      Linking.openURL(session.peer.metadata.redirect?.native).catch(() => {
        
        if (session.peer.metadata.redirect?.universal) {
          Linking.openURL(session.peer.metadata.redirect?.universal);
        } else {
          toast(session.peer.metadata.name, toastType, sessionIsDeepLinked);
        }
      });
    } else if (session.peer.metadata.redirect?.universal) {
      Linking.openURL(session.peer.metadata.redirect?.universal);
    } else {
      toast(session.peer.metadata.name, toastType, sessionIsDeepLinked);
    }
  } catch (error: any) {
    toast(session.peer.metadata.name, toastType, sessionIsDeepLinked);
  }
};
