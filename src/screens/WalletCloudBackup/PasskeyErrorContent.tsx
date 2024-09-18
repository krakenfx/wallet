import React, { PropsWithChildren } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

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

type Props = PropsWithChildren & {
  title: string;
  subtitle?: string;
  description: string;
  suggestKeychainSettings?: boolean;
} & (WithSupportSuggestionProps | WithoutSupportSuggestionProps);

export const PasskeyErrorContent: React.FC<Props> = ({
  title,
  subtitle,
  description,
  children,
  suggestKeychainSettings,
  suggestManualImport,
  suggestSupport = true,
}) => {
  const openSupport = () => Linking.openURL(URLs.supportArticles);

  return (
    <View style={styles.container}>
      <Label type="boldDisplay3" style={styles.title}>
        {title}
      </Label>
      {!!subtitle && (
        <Label type="regularBody" color="light75">
          {subtitle}
        </Label>
      )}
      <Label type="regularBody" color="light75">
        {description}
      </Label>
      {suggestKeychainSettings && (
        <>
          <Label type="regularBody" color="light75">
            {loc.walletCloudBackupError.keychainSteps.one.regular}
            <Label type="boldCaption1">{loc.walletCloudBackupError.keychainSteps.one.bold}</Label>
          </Label>
          <Label type="regularBody" color="light75">
            {loc.walletCloudBackupError.keychainSteps.two.regular}
            <Label type="boldCaption1">{loc.walletCloudBackupError.keychainSteps.two.bold}</Label>
          </Label>
        </>
      )}
      {children}
      {!!suggestSupport && (
        <Label type="regularBody" color="light75">
          {suggestManualImport ? loc.walletCloudBackupError.supportHint.regularWithManualBackup : loc.walletCloudBackupError.supportHint.regular}
          <Label type="boldBody" onPress={openSupport}>
            {loc.walletCloudBackupError.supportHint.link}
          </Label>
        </Label>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
});
