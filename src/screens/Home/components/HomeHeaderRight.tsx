import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { SvgIcon } from '@/components/SvgIcon';
import { useWalletBackupSettings } from '@/hooks/useWalletBackupSettings';
import { Routes } from '@/Routes';
import { useTheme } from '@/theme/themes';

export const HomeHeaderRight = () => {
  const navigation = useNavigation();
  const onSettingsPress = useCallback(() => {
    navigation.navigate(Routes.Settings);
  }, [navigation]);

  const onLongPress = useCallback(() => {
    navigation.navigate(Routes.Debug);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SvgIcon
        name="gear"
        onPress={onSettingsPress}
        onLongPress={onLongPress}
        testID="SettingsIcon"
        style={styles.settingsIcon}
        hitSlop={{ top: 16, bottom: 16, left: 0, right: 0 }}
      />
      <WalletBackupNeededBadge />
    </View>
  );
};

const WalletBackupNeededBadge = () => {
  const { isAnyBackupSuggested, isAnyBackupCompleted } = useWalletBackupSettings();
  const { colors } = useTheme();

  if (!isAnyBackupCompleted) {
    return <View style={[styles.walletBackupNeededBadge, { backgroundColor: colors.red400 }]} />;
  }

  if (isAnyBackupSuggested) {
    return <View style={[styles.walletBackupNeededBadge, { backgroundColor: colors.yellow500 }]} />;
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    marginRight: 28 - 20,
  },
  gap: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  settingsIcon: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  walletBackupNeededBadge: {
    height: 8,
    width: 8,
    borderRadius: 4,
    position: 'absolute',
    right: 2,
    top: 10,
  },
});
