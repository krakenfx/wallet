import { ObjectSchema } from 'realm';

import { Currency } from '@/screens/Settings/currency';

import { LanguageTag } from '/loc';

export enum RealmSettingsKey {
  accountNumber = 'accountNumber',
  language = 'language',
  isWalletBackupDone = 'isWalletBackupDone',
  deviceFontScale = 'deviceFontScale',
  isTestnetEnabled = 'isTestnetEnabled',
  filterInUnverifiedAssets = 'filterInUnverifiedAssets',
  filterInBlacklistedAssets = 'filterInBlacklistedAssets',
  isPushPromptNeeded = 'isPushPromptNeeded',
  walletConnectExplainerNeeded = 'walletConnectExplainerNeeded',
  currency = 'currency',
}

export type SettingsType = {
  [RealmSettingsKey.accountNumber]: number;
  [RealmSettingsKey.language]: LanguageTag;
  [RealmSettingsKey.isWalletBackupDone]: boolean;
  [RealmSettingsKey.deviceFontScale]: number;
  [RealmSettingsKey.isTestnetEnabled]: boolean;
  [RealmSettingsKey.filterInUnverifiedAssets]: boolean;
  [RealmSettingsKey.filterInBlacklistedAssets]: boolean;
  [RealmSettingsKey.isPushPromptNeeded]: boolean;
  [RealmSettingsKey.walletConnectExplainerNeeded]: boolean;
  [RealmSettingsKey.currency]: Currency;
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
