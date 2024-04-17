import React from 'react';
import { Image, Linking, StyleSheet, View } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { LargeHeader } from '@/components/LargeHeader';
import navigationStyle from '@/components/navigationStyle';
import { SettingsItem, SettingsSectionHeader } from '@/screens/Settings/components';

import { SettingsBox } from '../components/SettingsBox';

import { URLs } from '/config';
import loc from '/loc';

export const SupportScreen = () => {
  const handleSupportCenter = () => {
    Linking.openURL(URLs.supportArticles);
  };

  const handleContactUs = () => {
    Linking.openURL(URLs.supportContact);
  };

  return (
    <GradientScreenView>
      <LargeHeader title={loc.settings.support} />
      <View style={styles.container}>
        <SettingsBox isFirst isHighlighted style={styles.supportCenter}>
          <View style={styles.supportCenterLabels}>
            <Label type="boldTitle0" style={styles.heading}>
              {loc.support.knowledgeBaseTitle}
            </Label>
            <Label type="regularBody" color="light75">
              {loc.support.knowledgeBaseDesc}
            </Label>
          </View>
          <Image source={require('@/assets/images/common/knowledge-base.png')} />
        </SettingsBox>
        <SettingsItem testID="SupportCenterButton" icon="help" isLast isHighlighted title={loc.support.visitSupportCenter} onPress={handleSupportCenter} />
        <SettingsSectionHeader title={loc.support.getInTouch} />
        <SettingsItem testID="ContactButton" icon="support" isFirst isLast isHighlighted title={loc.support.contactUs} onPress={handleContactUs} />
      </View>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    marginVertical: 40,
  },
  supportCenter: {
    paddingVertical: 8,
  },
  supportCenterLabels: {
    flex: 1,
    marginLeft: 4,
    marginRight: 12,
  },
  heading: {
    marginBottom: 4,
  },
});

SupportScreen.navigationOptions = navigationStyle({ title: '', headerTransparent: true });
