import { StyleSheet, View } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { useSettingsMutations } from '@/realm/settings';
import { useIsHideBalancesEnabled } from '@/realm/settings/useIsHideBalancesEnabled';
import { navigationStyle } from '@/utils/navigationStyle';

import { SettingsBox, SettingsSwitch } from './components';

import loc from '/loc';

export const PrivacyScreen = () => {
  const isHideBalancesEnabled = useIsHideBalancesEnabled();
  const { setHideBalances } = useSettingsMutations();

  useHeaderTitle(loc.settings.privacy);

  const handleHideBalancesChange = async () => {
    await setHideBalances(!isHideBalancesEnabled);
  };

  return (
    <GradientScreenView>
      <View style={styles.container}>
        <SettingsBox isFirst isLast isHighlighted>
          <SettingsSwitch
            testID="HideBalancesSwitch"
            icon="eye"
            text={loc.settings.hideBalances}
            enabled={isHideBalancesEnabled}
            onToggle={handleHideBalancesChange}
          />
        </SettingsBox>
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
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    paddingBottom: 20,
  },
});

PrivacyScreen.navigationOptions = navigationStyle({ title: loc.settings.privacy, headerTransparent: true });
