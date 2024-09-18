import { useMemo } from 'react';

import { RealmSettingsKey, useSettingsByKey, useSettingsMutations } from '@/realm/settings';

import { FeatureFlag, useFeatureFlagEnabled } from '@/utils/featureFlags';

import { isPasskeySupported } from '/modules/cloud-backup';

export const useWalletBackupSettings = () => {
  const isFeatureEnabled = useFeatureFlagEnabled(FeatureFlag.iCloudBackupEnabled);
  const { setCloudBackupCompleted, setCloudBackupDismissed, setManualBackupDismissed } = useSettingsMutations();

  const cloudBackupCredentialID = useSettingsByKey(RealmSettingsKey.cloudBackupCredentialID);
  const isManualBackupCompleted = !!useSettingsByKey(RealmSettingsKey.isWalletBackupDone);
  const isCloudBackupDismissed = !!useSettingsByKey(RealmSettingsKey.isCloudBackupDismissed);
  const isManualBackupDismissed = !!useSettingsByKey(RealmSettingsKey.isManualBackupDismissed);

  return useMemo(() => {
    const isCloudBackupSupported = isFeatureEnabled && isPasskeySupported;
    const isCloudBackupCompleted = !!cloudBackupCredentialID;
    const isCloudBackupNeeded = isCloudBackupSupported && !isCloudBackupCompleted;
    const isCloudBackupSuggested = isCloudBackupNeeded && !isCloudBackupDismissed;

    const isManualBackupNeeded = !isManualBackupCompleted;
    const isManualBackupSuggested = isCloudBackupCompleted && isManualBackupNeeded && !isManualBackupDismissed;

    const isAnyBackupCompleted = isManualBackupCompleted || isCloudBackupCompleted;
    const isAnyBackupNeeded = isManualBackupNeeded || isCloudBackupNeeded;
    const isAnyBackupSuggested = isManualBackupSuggested || isCloudBackupSuggested;

    return {
      isCloudBackupSupported,
      isCloudBackupCompleted,
      isCloudBackupNeeded,
      isCloudBackupSuggested,

      setCloudBackupCompleted,
      setCloudBackupDismissed,

      isManualBackupNeeded,
      isManualBackupCompleted,
      isManualBackupSuggested,

      setManualBackupDismissed,

      isAnyBackupCompleted,
      isAnyBackupNeeded,
      isAnyBackupSuggested,
    };
  }, [
    isFeatureEnabled,
    cloudBackupCredentialID,
    isCloudBackupDismissed,
    isManualBackupCompleted,
    isManualBackupDismissed,
    setCloudBackupCompleted,
    setCloudBackupDismissed,
    setManualBackupDismissed,
  ]);
};
