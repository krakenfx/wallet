import { sortBy } from 'lodash';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';

import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import { BackupMethodSelector } from '@/components/WalletBackup/BackupMethodSelector';
import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';
import { useLanguage } from '@/realm/settings';
import { NavigationProps, Routes } from '@/Routes';
import { useTheme } from '@/theme/themes';
import { formatPasskeyDate } from '@/utils/dateFormatter';
import { navigationStyle } from '@/utils/navigationStyle';

import loc from '/loc';

import { getDateLocale } from '/loc/date';

export const WalletCloudImportSelectScreen = ({ navigation, route: { params } }: NavigationProps<'OnboardingWalletCloudImportSelection'>) => {
  const paddingBottom = useBottomElementSpacing();
  const language = useLanguage();

  const { colors } = useTheme();

  return (
    <GradientScreenView style={styles.container}>
      <View style={styles.heading}>
        <Label type="boldDisplay4">{loc.onboardingImportCloudBackup.selection.title}</Label>
        <Label type="regularBody" color="light75">
          {loc.onboardingImportCloudBackup.selection.desc}
        </Label>
      </View>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom }]} bounces={false}>
        {sortBy(params.backups, 'date')
          .reverse()
          .map((backup, index) => (
            <BackupMethodSelector
              key={backup.credentialID}
              icon={<Image source={require('@/assets/images/common/iCloud.png')} />}
              onPress={() => navigation.navigate(Routes.OnboardingWalletCloudImport, { selectedBackup: backup })}
              title={backup.device}
              subtitle={formatPasskeyDate(backup.date, getDateLocale(language))}
              containerStyle={styles.item}
              rightElement={
                index === 0 && (
                  <View>
                    <View style={[styles.badge, { backgroundColor: colors.green400_15 }]}>
                      <Label type="regularCaption1" color="green400">
                        {loc.onboardingImportCloudBackup.selection.recent}
                      </Label>
                    </View>
                  </View>
                )
              }
            />
          ))}
      </ScrollView>
    </GradientScreenView>
  );
};

WalletCloudImportSelectScreen.navigationOptions = navigationStyle({
  headerShown: true,
  headerTransparent: true,
  headerStyle: {
    backgroundColor: 'transparent',
  },
  title: '',
});

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
  },
  heading: {
    gap: 12,
    marginHorizontal: 12,
  },
  scroll: {
    paddingVertical: 12,
  },
  item: {
    marginVertical: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
