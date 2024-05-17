import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useIsWalletBackupPromptNeeded } from '@/realm/settings';
import { NavigationProps, RouteProps, Routes } from '@/Routes';
import { AssetBalanceId } from '@/types';

import { Button } from './Button';

import loc from '/loc';

interface FloatingSendReceiveProps {
  assetBalanceId: AssetBalanceId;
  navigation: NavigationProps<keyof RouteProps>['navigation'];
}

export const FloatingSendReceive = ({ assetBalanceId, navigation }: FloatingSendReceiveProps) => {
  const isWalletBackupPromptNeeded = useIsWalletBackupPromptNeeded();

  const onReceive = useCallback(() => {
    navigation.push(Routes.Receive, { assetBalanceId });
    isWalletBackupPromptNeeded && navigation.push(Routes.WalletBackupPrompt);
  }, [isWalletBackupPromptNeeded, navigation, assetBalanceId]);

  const onSend = useCallback(() => {
    navigation.navigate(Routes.SendStack, { screen: 'Send', params: { assetBalanceId } });
  }, [navigation, assetBalanceId]);

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, [{ bottom: insets.bottom + 30 }]]}>
      <Button
        size="small"
        icon="send"
        onPress={onSend}
        style={styles.buttonLeft}
        testID="SendButton"
        color="kraken"
        iconAbove
        text={loc.floatingTransactionActivityButtons.send}
        textColor="light75"
      />
      <Button
        size="small"
        icon="receive"
        onPress={onReceive}
        style={styles.buttonRight}
        testID="ReceiveButton"
        color="kraken"
        iconAbove
        text={loc.floatingTransactionActivityButtons.receive}
        textColor="light75"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '70%',
    left: '15%',
    position: 'absolute',
    flexDirection: 'row',
  },
  buttonLeft: {
    flex: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: 1,
    paddingVertical: 10,
  },
  buttonRight: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingVertical: 10,
  },
});
