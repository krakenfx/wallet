import type React from 'react';

import { BottomSheetView } from '@gorhom/bottom-sheet';
import { StackActions, useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, View } from 'react-native';
import { SequencedTransition } from 'react-native-reanimated';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { Routes } from '@/Routes';

import walletBackupPromptImage from '../images/walletBackupPrompt.png';

import loc from '/loc';

export const WalletBackupPrompt: React.FC = () => {
  const navigation = useNavigation();

  const navigateToSettingsWalletBackup = () => {
    navigation.dispatch(StackActions.popToTop());
    navigation.navigate(Routes.Settings, { screen: Routes.SettingsWalletBackup, initial: false });
  };

  return (
    <BottomSheetView testID="WalletBackupPromptScreen">
      <Image source={walletBackupPromptImage} style={styles.image} />
      <View style={styles.body}>
        <Label type="boldDisplay3" style={styles.header}>
          {loc.walletBackupPrompt.header}
        </Label>
        <Label type="regularTitle1" color="light75">
          {loc.walletBackupPrompt.body}
        </Label>
      </View>
      <FloatingBottomButtons
        noAbsolutePosition
        style={styles.buttonContainer}
        primary={{
          text: loc.walletBackupPrompt.backUpNow,
          onPress: navigateToSettingsWalletBackup,
          testID: 'WalletBackupPromptBackUpButton',
          layout: SequencedTransition.duration(1000),
        }}
      />
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  body: {
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  image: {
    alignSelf: 'center',
    marginVertical: 16,
  },
  buttonContainer: {
    marginTop: 70,
    justifyContent: 'center',
  },
  header: {
    lineHeight: 40,
  },
});
