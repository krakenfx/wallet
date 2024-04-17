import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import navigationStyle from '@/components/navigationStyle';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { useSettingsMutations } from '@/realm/settings';
import { useClearAppCache } from '@/realm/settings/useClearAppCache';
import { useIsTestnetEnabled } from '@/realm/settings/useIsTestnetEnabled';
import { Routes } from '@/Routes';
import { SettingsItem, SettingsSwitch } from '@/screens/Settings/components';
import { SettingsBox } from '@/screens/Settings/components/SettingsBox';
import { SettingsNavigationProps } from '@/screens/Settings/SettingsRouter';

import loc from '/loc';

export const AdvancedSettingsScreen = ({ navigation }: SettingsNavigationProps<'AdvancedSettings'>) => {
  const isTestNetEnabled = useIsTestnetEnabled();
  const { setIsTestnetEnabled } = useSettingsMutations();
  const { clearAppCache } = useClearAppCache();

  useHeaderTitle(loc.settings.advanced);

  const handleTestnetChange = async () => {
    await setIsTestnetEnabled(!isTestNetEnabled);
  };

  const handleDeleteAllData = () => {
    navigation.navigate(Routes.DeleteAllDataWarningScreen);
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
