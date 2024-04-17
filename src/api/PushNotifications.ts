import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid, Platform } from 'react-native';
import { Notification, Notifications, RegistrationError } from 'react-native-notifications';

import { getGroundControl } from './base/apiFactory';
import { TokenConfigurationType } from './types';

import { showGeneralFetchError } from '/helpers/errorHandler';
import { getIanaLanguage } from '/loc';

const pckg = require('/package.json');

export enum ERROR_CODE {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}

const DEFAULT_NOTIFICATION_CHANNEL = 'channel-default';

Notifications.setNotificationChannel({
  channelId: DEFAULT_NOTIFICATION_CHANNEL,
  name: 'Miscellaneous',
  importance: 5,
});

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

  async requestToken(): Promise<string> {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      if (res !== PermissionsAndroid.RESULTS.GRANTED) {
        throw Error(ERROR_CODE.PERMISSION_DENIED);
      }
    }
    Notifications.registerRemoteNotifications();
    return new Promise((resolve, reject) => {
      Notifications.events().registerRemoteNotificationsRegistered(event => {
        console.log('Device Token Received', event.deviceToken);
        this.deviceToken = event.deviceToken;

        AsyncStorage.setItem(PushNotifications.STORAGE_KEY_DEVICE_TOKEN, String(this.deviceToken));
        resolve(event.deviceToken);
      });

      Notifications.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
        console.log(event.code, event.localizedDescription, event.domain);
      });

      Notifications.events().registerRemoteNotificationsRegistrationDenied(() => {
        console.log('Notification permissions not granted');
        reject(new Error(ERROR_CODE.PERMISSION_DENIED));
      });
    });
  }

  async registerRemoteNotifications() {
    await Promise.race([this.requestToken(), new Promise((_, reject) => setTimeout(() => reject(new Error('Failed to retrieve token')), 10000))]);
    if (PushNotifications.hasRegisteredEventListeners) {
      return;
    }

    Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion) => {
      console.log(`Notification received in foreground : ${JSON.stringify(notification, null, 2)}`);
      if (Platform.OS === 'android') {
        if (!notification.payload || (!notification.payload.android_channel_id && !notification.payload['gcm.notification.android_channel_id'])) {
          notification.payload.android_channel_id = DEFAULT_NOTIFICATION_CHANNEL;
          Notifications.postLocalNotification(notification.payload);
        }
      }
      completion({ alert: true, sound: true, badge: false });
    });

    Notifications.events().registerNotificationOpened((notification: Notification, completion) => {
      console.log(`Notification opened: ${notification.payload}`);
      completion();
    });
    PushNotifications.hasRegisteredEventListeners = true;
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
    return Notifications.isRegisteredForRemoteNotifications();
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
        app_version: pckg.version,
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

  static setBadgeCount(count: number) {
    Notifications.ios.setBadgeCount(count);
  }
}
