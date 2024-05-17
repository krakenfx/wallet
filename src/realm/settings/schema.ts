import { ObjectSchema } from 'realm';

import { Currency } from '@/screens/Settings/currency';

import { LanguageTag } from '/loc';

export enum RealmSettingsKey {
  accountNumber = 'accountNumber',
  currency = 'currency',
  deviceFontScale = 'deviceFontScale',
  filterInBlacklistedAssets = 'filterInBlacklistedAssets',
  filterInUnverifiedAssets = 'filterInUnverifiedAssets',
  hasViewedWalletBackupPrompt = 'isWalletBackupPromptNeeded',
  isPushPromptNeeded = 'isPushPromptNeeded',
  isTestnetEnabled = 'isTestnetEnabled',
  isWalletBackupDone = 'isWalletBackupDone',
  language = 'language',
  walletConnectExplainerNeeded = 'walletConnectExplainerNeeded',
}

export type SettingsType = {
  [RealmSettingsKey.accountNumber]: number;
  [RealmSettingsKey.currency]: Currency;
  [RealmSettingsKey.deviceFontScale]: number;
  [RealmSettingsKey.filterInBlacklistedAssets]: boolean;
  [RealmSettingsKey.filterInUnverifiedAssets]: boolean;
  [RealmSettingsKey.hasViewedWalletBackupPrompt]: boolean;
  [RealmSettingsKey.isPushPromptNeeded]: boolean;
  [RealmSettingsKey.isTestnetEnabled]: boolean;
  [RealmSettingsKey.isWalletBackupDone]: boolean;
  [RealmSettingsKey.language]: LanguageTag;
  [RealmSettingsKey.walletConnectExplainerNeeded]: boolean;
};

export type Settings = {
  name: keyof SettingsType;
  value: SettingsType[keyof SettingsType];
};

export type RealmSettings = RealmTypeOf<Settings>;

export const REALM_TYPE_SETTINGS = 'Settings';
export const SettingsSchema: ObjectSchema = {
  name: REALM_TYPE_SETTINGS,
  primaryKey: 'name',
  properties: {
    name: 'string',
    value: 'mixed',
  },
};
