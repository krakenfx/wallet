import type { Currency } from '@/screens/Settings/currency';

import type { ObjectSchema } from 'realm';

import type { LanguageTag } from '/loc';

export enum RealmSettingsKey {
  accountNumber = 'accountNumber',
  currency = 'currency',
  deviceFontScale = 'deviceFontScale',
  filterInBlacklistedAssets = 'filterInBlacklistedAssets',
  filterInUnverifiedAssets = 'filterInUnverifiedAssets',
  hasViewedWalletBackupPrompt = 'isWalletBackupPromptNeeded',
  hasAcceptedExploreWarning = 'hasAcceptedExploreWarning',
  isPushPromptNeeded = 'isPushPromptNeeded',
  isTestnetEnabled = 'isTestnetEnabled',
  isWalletBackupDone = 'isWalletBackupDone',
  cloudBackupCredentialID = 'cloudBackupCredentialID',
  isCloudBackupDismissed = 'isCloudBackupDismissed',
  isManualBackupDismissed = 'isManualBackupDismissed',
  language = 'language',
  appOpenedCounter = 'appOpenedCounter',
  walletConnectTaskCompleted = 'walletConnectTaskCompleted',
  storeReviewTaskCompleted = 'storeReviewTaskCompleted',
  storeReviewSubmitted = 'storeReviewSubmitted',
  hideBalances = 'hideBalances',

  isAvaxLineaTaskModalCompleted = 'isAvaxLineaTaskModalCompleted',
  isBrowserExploreTaskModalCompleted = 'isBrowserExploreTaskModalCompleted',
  isSwapsTaskModalCompleted = 'isSwapsTaskModalCompleted',
}

export type SettingsType = {
  [RealmSettingsKey.accountNumber]: number;
  [RealmSettingsKey.currency]: Currency;
  [RealmSettingsKey.deviceFontScale]: number;
  [RealmSettingsKey.filterInBlacklistedAssets]: boolean;
  [RealmSettingsKey.filterInUnverifiedAssets]: boolean;
  [RealmSettingsKey.hasViewedWalletBackupPrompt]: boolean;
  [RealmSettingsKey.hasAcceptedExploreWarning]: boolean;
  [RealmSettingsKey.isPushPromptNeeded]: boolean;
  [RealmSettingsKey.isTestnetEnabled]: boolean;
  [RealmSettingsKey.isWalletBackupDone]: boolean;
  [RealmSettingsKey.cloudBackupCredentialID]: string;
  [RealmSettingsKey.isCloudBackupDismissed]: boolean;
  [RealmSettingsKey.isManualBackupDismissed]: boolean;
  [RealmSettingsKey.language]: LanguageTag;
  [RealmSettingsKey.walletConnectTaskCompleted]: boolean;
  [RealmSettingsKey.appOpenedCounter]: number;
  [RealmSettingsKey.storeReviewTaskCompleted]: boolean;
  [RealmSettingsKey.storeReviewSubmitted]: boolean;
  [RealmSettingsKey.hideBalances]: boolean;
  [RealmSettingsKey.isAvaxLineaTaskModalCompleted]: boolean;
  [RealmSettingsKey.isBrowserExploreTaskModalCompleted]: boolean;
  [RealmSettingsKey.isSwapsTaskModalCompleted]: boolean;
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
