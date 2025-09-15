import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { hideToast, showToast } from '@/components/Toast';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { useSettingsMutations } from '@/realm/settings';
import { useClearAppCache } from '@/realm/settings/useClearAppCache';
import { useIsTestnetEnabled } from '@/realm/settings/useIsTestnetEnabled';
import { Routes } from '@/Routes';
import { useIsAppLockUsed } from '@/screens/Settings/appLock/hooks';
import { SettingsItem, SettingsSwitch } from '@/screens/Settings/components';
import { SettingsBox } from '@/screens/Settings/components/SettingsBox';
import type { SettingsNavigationProps } from '@/screens/Settings/SettingsRouter';
import { getAppLockSecret, saveAppLockProtectedValue } from '@/secureStore';
import { KeychainKey, setInKeychain } from '@/secureStore/keychain';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';
import { arrayBufferToHexString, encryptValue } from '@/secureStore/utils';
import { loadMnemonicSlow } from '@/utils/loadMnemonicSlow';
import { navigationStyle } from '@/utils/navigationStyle';

import { handleError } from '/helpers/errorHandler';
import loc from '/loc';

const UPDATE_STORAGE_TOAST_ID = 'updatingStorage';

export const showProcessing = async () =>
  showToast({
    type: 'info',
    text: loc.settings.updateStorageNotification,
    id: UPDATE_STORAGE_TOAST_ID,
    testID: UPDATE_STORAGE_TOAST_ID,
    dismissMode: 'event',
    iconLottieSource: require('@/assets/lottie/refreshSpinner.json'),
  });

export const showSuccess = async () =>
  showToast({
    type: 'success',
    text: loc.settings.updateStorageNotificationSuccess,
    duration: 3000,
  });

export const AdvancedSettingsScreen = ({ navigation }: SettingsNavigationProps<'AdvancedSettings'>) => {
  const isTestNetEnabled = useIsTestnetEnabled();
  const { setIsTestnetEnabled } = useSettingsMutations();
  const { clearAppCache } = useClearAppCache();
  const { getMnemonic } = useSecuredKeychain();
  const { isAppLockUsed } = useIsAppLockUsed();

  const isUpdatingStorage = useRef(false);

  useHeaderTitle(loc.settings.advanced);

  const handleTestnetChange = async () => {
    await setIsTestnetEnabled(!isTestNetEnabled);
  };

  const handleDeleteAllData = () => {
    navigation.navigate(Routes.DeleteAllDataWarningScreen);
  };

  const updateStorage = async () => {
    if (isUpdatingStorage.current) {
      return;
    }
    await showProcessing();
    isUpdatingStorage.current = true;
    const response = await getMnemonic(undefined, 'updateStorage');
    if (typeof response === 'boolean') {
      handleError('Can not read mnemonic', 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.settings.updateStorageNotificationError });
      isUpdatingStorage.current = false;
      return;
    }
    const { secret: mnemonic, password } = response;

    if (mnemonic) {
      const seedBuffer = await loadMnemonicSlow(mnemonic);
      let seedBufferString = arrayBufferToHexString(seedBuffer);
      if (password) {
        seedBufferString = await encryptValue(seedBufferString, password, 'hex');
      }
      if (isAppLockUsed) {
        const appLockSecret = await getAppLockSecret();
        await saveAppLockProtectedValue(KeychainKey.seedBufferKey, seedBufferString, appLockSecret, 'hex');
      } else {
        await setInKeychain(KeychainKey.seedBufferKey, seedBufferString, false);
      }
    }
    hideToast({ id: UPDATE_STORAGE_TOAST_ID });
    await showSuccess();
    isUpdatingStorage.current = false;
  };

  return (
    <GradientScreenView>
      <View style={styles.container}>
        <SettingsBox isFirst isHighlighted>
          <SettingsSwitch testID="TestnetSwitch" icon="tool" text={loc.settings.testnet} enabled={isTestNetEnabled} onToggle={handleTestnetChange} />
        </SettingsBox>
        <SettingsBox isLast isHighlighted style={styles.testnetDescription}>
          <Label type="regularCaption1">{loc.settings.testnetDescription}</Label>
        </SettingsBox>
        <SettingsItem icon="repeat" title={loc.settings.refreshAll} label={loc.settings.refreshAllDesc} onPress={clearAppCache} testID="ClearCacheButton" />
        <SettingsItem icon="lock" title={loc.settings.updateStorage} onPress={updateStorage} testID="UpdateStorageButton" />
        <SettingsItem isWarningAction icon="trash" title={loc.settings.deleteAll} onPress={handleDeleteAllData} testID="DeleteAllButton" />
      </View>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 32,
    marginHorizontal: 12,
  },
  testnetDescription: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    paddingBottom: 20,
  },
});

AdvancedSettingsScreen.navigationOptions = navigationStyle({ title: loc.settings.advanced, headerTransparent: true });
