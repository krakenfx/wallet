import type React from 'react';

import { Image, StyleSheet, View } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label, type LabelProps } from '@/components/Label';

import { useBrowser } from '@/hooks/useBrowser';

import { getOSMajorVersionNumber } from '@/utils/getOSMajorVersionNumber';

import { URLs } from '/config';
import loc from '/loc';

type WithSupportSuggestionProps = {
  suggestSupport?: true;
  suggestManualImport?: boolean;
};

type WithoutSupportSuggestionProps = {
  suggestSupport?: false | never;
  suggestManualImport?: never;
};

type Props = {
  title: string;
  suggestKeychainSettings?: boolean;
  showKeychainImage?: boolean;
  showDescripton?: boolean;
  noPasskeyFound?: boolean;
  footerLines?: string[];
} & (WithSupportSuggestionProps | WithoutSupportSuggestionProps);

const keychainSettingsLabels = (noPasskeyFound?: boolean) =>
  getOSMajorVersionNumber() >= 18
    ? {
        desc: noPasskeyFound ? loc.walletCloudBackupError.noPasskeyFound.descriptioniOS18 : loc.walletCloudBackupError.keychainSteps.formatted.ios18.title,
        tips: [
          {
            title: loc.walletCloudBackupError.keychainSteps.formatted.ios18.tips.one.title,
            steps: [
              loc.walletCloudBackupError.keychainSteps.formatted.ios18.tips.one.stepOne,
              loc.walletCloudBackupError.keychainSteps.formatted.ios18.tips.one.stepTwo,
            ],
          },
          {
            title: loc.walletCloudBackupError.keychainSteps.formatted.ios18.tips.two.title,
            steps: [
              loc.walletCloudBackupError.keychainSteps.formatted.ios18.tips.two.stepOne,
              loc.walletCloudBackupError.keychainSteps.formatted.ios18.tips.two.stepTwo,
            ],
          },
        ],
      }
    : {
        desc: noPasskeyFound ? loc.walletCloudBackupError.noPasskeyFound.descriptioniOS17 : loc.walletCloudBackupError.keychainSteps.formatted.ios17.title,
        tips: [
          {
            title: loc.walletCloudBackupError.keychainSteps.formatted.ios17.tips.one.title,
            steps: [
              loc.walletCloudBackupError.keychainSteps.formatted.ios17.tips.one.stepOne,
              loc.walletCloudBackupError.keychainSteps.formatted.ios17.tips.one.stepTwo,
            ],
          },
          {
            title: loc.walletCloudBackupError.keychainSteps.formatted.ios17.tips.two.title,
            steps: [
              loc.walletCloudBackupError.keychainSteps.formatted.ios17.tips.two.stepOne,
              loc.walletCloudBackupError.keychainSteps.formatted.ios17.tips.two.stepTwo,
            ],
          },
        ],
      };

export const PasskeyErrorContent: React.FC<Props> = ({
  title,
  noPasskeyFound,
  showKeychainImage,
  suggestKeychainSettings,
  suggestManualImport,
  showDescripton,
  suggestSupport,
  footerLines,
}) => {
  const { openURL } = useBrowser();
  const openSupport = () => openURL(URLs.supportArticles);

  const textProps: Partial<LabelProps> = { type: 'regularBody', color: 'light75' };

  const keychainHints = suggestKeychainSettings ? keychainSettingsLabels(noPasskeyFound) : undefined;

  return (
    <ScrollView>
      {showKeychainImage && (
        <Image
          source={
            getOSMajorVersionNumber() >= 18
              ? require('@/assets/images/iCloudBackup/passwordsRequired.png')
              : require('@/assets/images/iCloudBackup/keychainRequired.png')
          }
          style={styles.image}
        />
      )}
      <View style={styles.container}>
        <View style={[styles.inset, styles.header]}>
          <Label type="boldDisplay3" style={styles.title}>
            {title}
          </Label>
          {!!keychainHints && showDescripton && <Label {...textProps}>{keychainHints.desc}</Label>}
        </View>
        {keychainHints &&
          keychainHints.tips.map(tip => (
            <View key={tip.title} style={styles.tipContainer}>
              <GradientItemBackground backgroundType="modal" />
              <Label {...textProps} style={styles.tipTitle}>
                {tip.title}
              </Label>
              {tip.steps.map(step => (
                <Label {...textProps} boldType="boldCaption1">
                  {`  •   ${step}`}
                </Label>
              ))}
            </View>
          ))}
        {footerLines?.map((line, i) => (
          <Label key={i} {...textProps} style={styles.inset}>
            {line}
          </Label>
        ))}
        {!!suggestSupport && (
          <Label {...textProps} style={styles.inset}>
            {suggestManualImport ? loc.walletCloudBackupError.supportHint.regularWithManualBackup : loc.walletCloudBackupError.supportHint.regular}
            <Label type="boldBody" onPress={openSupport}>
              {loc.walletCloudBackupError.supportHint.link}
            </Label>
          </Label>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 16,
    marginBottom: 24,
  },
  image: {
    alignSelf: 'center',
  },
  inset: {
    paddingHorizontal: 12,
  },
  header: {
    gap: 8,
  },
  tipTitle: {
    marginBottom: 4,
  },
  title: {
    marginBottom: 8,
  },
  tipContainer: {
    padding: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
