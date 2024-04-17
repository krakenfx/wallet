import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import navigationStyle from '@/components/navigationStyle';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { SettingsItem } from '@/screens/Settings/components';

import { URLs } from '/config';
import loc from '/loc';

export const AboutScreen = () => {
  useHeaderTitle(loc.settings.about);

  const handlePrivacyPolicyPress = () => {
    Linking.openURL(URLs.privacyPolicy);
  };

  const handleTermsOfServicePress = () => {
    Linking.openURL(URLs.termsOfService);
  };

  const handleReleaseNotesPress = () => {
    Linking.openURL(URLs.releaseNotes);
  };

  return (
    <GradientScreenView>
      <View style={styles.container}>
        <SettingsItem title={loc.about.privacyPolicy} onPress={handlePrivacyPolicyPress} icon="shield-tick" testID="PrivacyPolicyButton" />
        <SettingsItem title={loc.about.termsOfService} onPress={handleTermsOfServicePress} icon="terms" testID="TermsOfServiceButton" />
        <SettingsItem title={loc.about.blog} onPress={handleReleaseNotesPress} icon="sheet" testID="BlogButton" />
      </View>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
  },
});

AboutScreen.navigationOptions = navigationStyle({ title: loc.settings.about, headerTransparent: true });
