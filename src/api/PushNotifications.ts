import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { pick } from 'lodash';
import { Platform } from 'react-native';
import { getVersion } from 'react-native-device-info';

import { getGroundControl } from './base/apiFactory';
import { TokenConfigurationType } from './types';

import { showGeneralFetchError } from '/helpers/errorHandler';
import { getIanaLanguage } from '/loc';

import pckg from '/package.json';

export enum ERROR_CODE {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}

if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('channel-default', {
    name: 'Miscellaneous',
    importance: Notifications.AndroidImportance.HIGH,
  });

  Notifications.setNotificationHandler({
    handleNotification: async n => {
      if (n.request.identifier.startsWith('local:')) {
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        };
      }
      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      };
    },
  });
} else {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export class PushNotifications {
  private static instance: PushNotifications;
  private static STORAGE_KEY_DEVICE_TOKEN = 'STORAGE_KEY_DEVICE_TOKEN';
  private static api: Awaited<ReturnType<typeof getGroundControl>>;
  private static hasRegisteredEventListeners: boolean;

  private deviceToken: string | undefined | null;

  private constructor() {}

  protected async getCachedGroundControl() {
    if (!PushNotifications.api) {
      PushNotifications.api = await getGroundControl();
    }

    return PushNotifications.api;
  }

  public static getInstance(): PushNotifications {
    if (PushNotifications.instance) {
      return PushNotifications.instance;
    }

    PushNotifications.instance = new PushNotifications();
    return PushNotifications.instance;
  }

  async requestToken() {
    const deviceToken = await Notifications.getDevicePushTokenAsync();
    if (!deviceToken) {
      throw Error('Empty device token');
    }
    if (!(deviceToken.type === 'android' || deviceToken.type === 'ios')) {
      throw Error('Invalid device token');
    }
    this.deviceToken = deviceToken.data;
    AsyncStorage.setItem(PushNotifications.STORAGE_KEY_DEVICE_TOKEN, String(this.deviceToken));
  }

  async registerRemoteNotifications() {
    await this.requestPermissions();
    await this.requestToken();

    if (!PushNotifications.hasRegisteredEventListeners) {
      Notifications.addNotificationReceivedListener(notification => {
        const { trigger, identifier } = notification.request;
        if (Platform.OS === 'android') {
          if (identifier.startsWith('local:')) {
            return;
          }
          if (trigger.type === 'push' && trigger.remoteMessage?.notification) {
            const content = pick(trigger.remoteMessage?.notification, [
              'body',
              'title',
              'titleLocalizationArgs',
              'titleLocalizationKey',
              'bodyLocalizationArgs',
              'bodyLocalizationKey',
            ]);
            Notifications.scheduleNotificationAsync({
              content: { ...content, data: trigger.remoteMessage.data },
              identifier: 'local:' + identifier,
              trigger: null,
            });
          }
        }
        console.log('notification received', notification);
      });
      PushNotifications.hasRegisteredEventListeners = true;
    }
  }

  async requestPermissions() {
    const settings = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: false,
        allowSound: true,
      },
    });
    const isGranted = settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

    if (!isGranted) {
      throw Error(ERROR_CODE.PERMISSION_DENIED);
    }
  }

  async getDeviceToken() {
    if (this.deviceToken === undefined) {
      this.deviceToken = await AsyncStorage.getItem(PushNotifications.STORAGE_KEY_DEVICE_TOKEN);
    }
    return this.deviceToken;
  }

  async clearToken() {
    return AsyncStorage.removeItem(PushNotifications.STORAGE_KEY_DEVICE_TOKEN);
  }

  async hasPermission() {
    const settings = await Notifications.getPermissionsAsync();
    return settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  }

  async getTokenConfiguration(): Promise<TokenConfigurationType> {
    if (!this.deviceToken) {
      throw new Error('Token not yet acquired');
    }

    const response = await (
      await this.getCachedGroundControl()
    ).POST('/getTokenConfiguration', {
      body: {
        token: this.deviceToken,
        os: Platform.OS,
      },
    });

    return response;
  }

  async changeSubscriptionLevel(levelName: string, newValue: boolean) {
    if (!this.deviceToken) {
      throw new Error('Token not yet acquired');
    }

    const currentConfig: TokenConfigurationType = await this.getTokenConfiguration();
    if (!currentConfig) {
      throw new Error('Cant save subscription level change: current configuration is not loaded');
    }

    const request = {
      body: Object.assign({}, currentConfig, {
        token: this.deviceToken,
        os: Platform.OS,
        lang: getIanaLanguage(),
        app_version: getVersion(),
        [levelName]: newValue,
      }),
    };

    await (await this.getCachedGroundControl()).POST('/setTokenConfiguration', request);
  }

  async saveTokenConfiguration() {
    if (!this.deviceToken) {
      throw new Error('Token not yet acquired');
    }

    const currentConfig: TokenConfigurationType = await this.getTokenConfiguration();

    const request = {
      body: Object.assign({}, currentConfig, {
        token: this.deviceToken,
        os: Platform.OS,
        lang: getIanaLanguage(),
        app_version: pckg.version,
      }),
    };
    await (await this.getCachedGroundControl()).POST('/setTokenConfiguration', request);
  }

  async subscribeAddressesToPushNotifications(addresses: string[]) {
    const deviceToken = await this.getDeviceToken();
    if (!deviceToken) {
      throw new Error("Can't subscribe: no device token acquired");
    }

    addresses = [...new Set(addresses)];

    console.log(`subscribing addresses ${addresses.join(',')} to push notifications`);
    await (
      await this.getCachedGroundControl()
    ).POST('/majorTomToGroundControl', {
      body: {
        token: deviceToken,
        addresses,
        hashes: [],
        txids: [],
        os: Platform.OS,
      },
    });
  }

  async subscribeTransactionsToPushNotifications(txids: string[]) {
    const deviceToken = await this.getDeviceToken();
    if (!deviceToken) {
      throw new Error("Can't subscribe: no device token acquired");
    }

    txids = [...new Set(txids)];

    console.log(`subscribing txids ${txids.join(',')} to push notifications`);
    try {
      await (
        await this.getCachedGroundControl()
      ).POST('/majorTomToGroundControl', {
        body: {
          token: deviceToken,
          addresses: [],
          hashes: [],
          txids: txids,
          os: Platform.OS,
        },
      });
    } catch (e) {
      showGeneralFetchError('ERROR_CONTEXT_PLACEHOLDER', e);
    }
  }
}
