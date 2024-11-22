import type React from 'react';

import { Image, StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/IconButton';
import { Label } from '@/components/Label';
import { BackupMethodSelector } from '@/components/WalletBackup/BackupMethodSelector';

import loc from '/loc';

interface ScrollFoterProps {
  isCloudBackupNeeded: boolean;
  isManualBackupNeeded: boolean;
  isCloudBackupSupported: boolean;
  isAnyBackupCompleted: boolean;
  onCloudBackupSelected: () => void;
  onManualBackupSelected: () => void;
}

export const SettingsSeedScrollFooter: React.FC<ScrollFoterProps> = ({
  isCloudBackupSupported,
  isAnyBackupCompleted,
  isCloudBackupNeeded,
  isManualBackupNeeded,
  onCloudBackupSelected,
  onManualBackupSelected,
}) => {
  const labels = getLabels({ isAnyBackupCompleted, isManualBackupNeeded, isCloudBackupNeeded });

  if (!isCloudBackupSupported || !labels) {
    return null;
  }

  return (
    <View style={styles.backupPrompts}>
      <View style={styles.backupLabels}>
        <Label type="boldDisplay4">{labels.title}</Label>
        <Label type="regularTitle2" color="light75">
          {labels.caption}
        </Label>
      </View>

      {isCloudBackupNeeded && (
        <BackupMethodSelector
          icon={<Image source={require('@/assets/images/common/iCloud.png')} />}
          onPress={onCloudBackupSelected}
          title={loc.walletBackupSelection.backupWithICloud}
          subtitle={loc.walletBackupSelection.iCloudDescLong}
          centerIcon
        />
      )}

      {isManualBackupNeeded && (
        <BackupMethodSelector
          icon={<IconButton size={24} name="pencil" style={[styles.iconSize, styles.iconRadius]} containerStyle={styles.iconRadius} />}
          onPress={onManualBackupSelected}
          title={loc.walletBackupSelection.backupManually}
          subtitle={loc.walletBackupSelection.manualBackupDescLong}
          centerIcon
        />
      )}
    </View>
  );
};

interface GetFooterLabelsOptions {
  isAnyBackupCompleted: boolean;
  isManualBackupNeeded: boolean;
  isCloudBackupNeeded: boolean;
}

function getLabels({ isAnyBackupCompleted, isManualBackupNeeded, isCloudBackupNeeded }: GetFooterLabelsOptions) {
  if (!isAnyBackupCompleted) {
    return {
      title: loc.walletBackupSelection.titleWithSubtitle,
      caption: loc.walletBackupSelection.prompt,
    };
  }

  if (isManualBackupNeeded) {
    return {
      title: loc.walletBackup.secondaryBackup.title,
      caption: loc.walletBackup.secondaryBackup.manual,
    };
  }

  if (isCloudBackupNeeded) {
    return {
      title: loc.walletBackup.secondaryBackup.title,
      caption: loc.walletBackup.secondaryBackup.iCloud,
    };
  }
}

const styles = StyleSheet.create({
  backupPrompts: {
    marginTop: 24,
    gap: 16,
  },
  backupLabels: {
    padding: 12,
    gap: 12,
  },
  iconSize: {
    width: 36,
    height: 36,
  },
  iconRadius: {
    borderRadius: 12,
  },
});
