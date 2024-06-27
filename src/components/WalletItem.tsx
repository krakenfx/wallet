import { useNavigation } from '@react-navigation/native';
import { noop } from 'lodash';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/IconButton';
import { Label } from '@/components/Label';
import { RealmAccount } from '@/realm/accounts';
import { useAppCurrency } from '@/realm/settings';
import { Routes } from '@/Routes';
import { useTheme } from '@/theme/themes';
import { formatCurrency } from '@/utils/formatCurrency';

import { GradientItemBackground, GradientItemBackgroundProps } from './GradientItemBackground';
import { Menu } from './Menu';
import { Touchable } from './Touchable';

import loc from '/loc';

export const WALLET_ITEM_HEIGHT = 68;
interface Props extends GradientItemBackgroundProps {
  isFirst?: boolean;
  isLast?: boolean;
  isCurrentAccount?: boolean;
  onPress?: (accountNumber: number) => void;
  account: RealmAccount;
  testID?: string;
}

export const WalletItem = ({ isFirst, isLast, isCurrentAccount, account, onPress, backgroundType, testID }: Props) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { currency } = useAppCurrency();

  const { accountCustomName, accountNumber, balance } = account;

  const containerBackgroundColor = isCurrentAccount ? colors.dark25 : undefined;
  const borderTopRadius = isFirst ? { borderTopLeftRadius: 16, borderTopRightRadius: 16 } : {};
  const borderBottomRadius = isLast ? { borderBottomLeftRadius: 16, borderBottomRightRadius: 16 } : {};
  const style = [styles.container, borderTopRadius, borderBottomRadius, { backgroundColor: containerBackgroundColor }];

  const handlePress = () => {
    if (onPress) {
      onPress(accountNumber);
    }
  };

  const handleEditPress = () => {
    navigation.navigate(Routes.AccountStack, { screen: Routes.EditAccount, params: { accountNumber: account.accountNumber } });
  };

  const handleConnectedAppsPress = () => {
    navigation.navigate(Routes.ConnectedApps, { accountNumber });
  };

  const handleAdvancedInfoPress = () => {
    navigation.navigate(Routes.AdvancedAccountInfo, { accountNumber: account.accountNumber });
  };

  const handleDeletePress = () => {
    navigation.navigate(Routes.AccountStack, { screen: Routes.DeleteAccountConfirm, params: { accountNumber: account.accountNumber } });
  };

  return (
    <Touchable onPress={handlePress} style={style} disabled={!onPress} testID={testID ?? `Wallet-${accountNumber}`}>
      <GradientItemBackground backgroundType={isCurrentAccount ? 'modalLight' : backgroundType} />
      <View style={styles.walletInfo}>
        <Label type="boldTitle2">{accountCustomName}</Label>
        {}
        <Label type="boldMonospace" color="light75" style={styles.balance}>
          {formatCurrency(balance, { currency })}
        </Label>
      </View>

      <Menu
        type="context"
        testID={`ManageIcon-${accountCustomName}`}
        items={[
          {
            title: loc.accountSwitch.menu.edit,
            icon: 'pencil',
            onPress: handleEditPress,
            testID: 'EditWallet',
          },
          {
            title: loc.accountSwitch.menu.connected_apps,
            icon: 'apps',
            onPress: handleConnectedAppsPress,
          },
          {
            title: loc.accountSwitch.menu.advanced_info,
            icon: 'tool',
            onPress: handleAdvancedInfoPress,
          },
          {
            title: loc.accountSwitch.menu.delete,
            tintColor: 'red400',
            icon: 'trash',
            onPress: handleDeletePress,
            testID: 'RemoveWallet',
          },
        ]}>
        <IconButton name="more" onPress={noop} />
      </Menu>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: WALLET_ITEM_HEIGHT,
    marginBottom: 1,
    overflow: 'hidden',
  },
  balance: {
    marginTop: 4,
  },
  walletInfo: {
    justifyContent: 'space-between',
  },
});
