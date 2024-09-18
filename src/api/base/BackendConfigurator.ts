import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_GROUNDCONTROL_BASE_URI, DEFAULT_HARMONY_BASE_URI } from '/config';

export default class BackendConfigurator {
  static STORAGE_KEY_GC_URI = 'STORAGE_KEY_GC_URI';
  static STORAGE_KEY_HARMONY_URI = 'STORAGE_KEY_HARMONY_URI';

  static async getGroundcontrolBaseUri(): Promise<string> {
    try {
      const storedUri = (await AsyncStorage.getItem(BackendConfigurator.STORAGE_KEY_GC_URI)) ?? DEFAULT_GROUNDCONTROL_BASE_URI;
      if (storedUri) {
        return storedUri;
      }
      throw new Error('DEFAULT_GROUNDCONTROL_BASE_URI is empty or null.');
    } catch (error) {
      throw new Error('Failed to retrieve DEFAULT_GROUNDCONTROL_BASE_URI base URI');
    }
  }
  static async getHarmonyBaseUri(): Promise<string> {
    try {
      const storedUri = (await AsyncStorage.getItem(BackendConfigurator.STORAGE_KEY_HARMONY_URI)) ?? DEFAULT_HARMONY_BASE_URI;
      if (storedUri) {
        return storedUri;
      }
      throw new Error('DEFAULT_HARMONY_BASE_URI is empty or null.');
    } catch (error) {
      throw new Error('Failed to retrieve DEFAULT_HARMONY_BASE_URI base URI');
    }
  }

  static async saveGroundcontrolBaseUri(newUri: string): Promise<void> {
    await AsyncStorage.setItem(BackendConfigurator.STORAGE_KEY_GC_URI, newUri);
  }

  static async saveHarmonyBaseUri(newUri: string): Promise<void> {
    await AsyncStorage.setItem(BackendConfigurator.STORAGE_KEY_HARMONY_URI, newUri);
  }
}
