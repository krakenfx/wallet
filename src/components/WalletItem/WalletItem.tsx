import { useNavigation } from '@react-navigation/native';
import { noop } from 'lodash';

import { StyleSheet, View } from 'react-native';

import { AvatarIcon } from '@/components/AvatarIcon';
import type { GradientItemBackgroundProps } from '@/components/GradientItemBackground';
import { GradientItemBackground } from '@/components/GradientItemBackground';
import { IconButton } from '@/components/IconButton';
import { Label } from '@/components/Label';
import { Menu } from '@/components/Menu';
import { Touchable } from '@/components/Touchable';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import type { RealmAccount } from '@/realm/accounts';
import { useAppCurrency } from '@/realm/settings';
import { useConnectedWithExchangeList } from '@/realm/settings/useConnectedWithExchangeList';
import { Routes } from '@/Routes';
import { useTheme } from '@/theme/themes';
import { formatCurrency } from '@/utils/formatCurrency';

import { Button } from '../Button/Button';

import { CircleIcon } from '../CircleIcon/CircleIcon';
import { ElementWithBadge } from '../ElementWithBadge/ElementWithBadge';

import loc from '/loc';

export const WALLET_ITEM_HEIGHT = 68;
interface Props extends GradientItemBackgroundProps {
  isFirst?: boolean;
  isLast?: boolean;
  isCurrentAccount?: boolean;
  onPress?: (accountNumber: number) => void;
  account: RealmAccount;
  showMenu?: boolean;
  showKrakenConnect?: boolean;
  testID?: string;
}

export const WalletItem = ({
  isFirst,
  isLast,
  isCurrentAccount,
  account,
  onPress,
  backgroundType,
  testID,
  showMenu = true,
  showKrakenConnect = false,
}: Props) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { currency } = useAppCurrency();

  const { accountCustomName, accountNumber, balance } = account;

  const containerBackgroundColor = isCurrentAccount ? colors.dark25 : undefined;
  const borderTopRadius = isFirst ? { borderTopLeftRadius: 16, borderTopRightRadius: 16 } : {};
  const borderBottomRadius = isLast ? { borderBottomLeftRadius: 16, borderBottomRightRadius: 16 } : {};
  const style = [styles.container, borderTopRadius, borderBottomRadius, { backgroundColor: containerBackgroundColor }];
  const balanceDisplay = useBalanceDisplay(formatCurrency(balance, { currency }));
  const connectedAccounts = useConnectedWithExchangeList();
  const isConnected = connectedAccounts.includes(accountNumber);

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

  const AvatarElement = <AvatarIcon accountNumber={account.accountNumber} accountAvatar={account.avatar} avatarSize={36} />;

  return (
    <Touchable onPress={handlePress} style={style} disabled={!onPress} testID={testID ?? `Wallet-${accountNumber}`}>
      <GradientItemBackground backgroundType={isCurrentAccount ? 'modalLight' : backgroundType} />
      <View style={styles.left}>
        <View style={styles.avatarContainer}>
          {isConnected ? (
            <ElementWithBadge
              maskedElement={AvatarElement}
              size={36}
              badgeSize={16}
              badgeElement={isConnected ? <CircleIcon name="kraken" backgroundColor="kraken" iconColor="light100" size={16} iconSize={10} /> : null}
            />
          ) : (
            AvatarElement
          )}
        </View>
        <View style={styles.walletInfo}>
          <Label type="boldTitle2">{accountCustomName}</Label>
          <Label type="boldMonospace" color="light75" style={styles.balance}>
            {balanceDisplay}
          </Label>
        </View>
      </View>
      {showKrakenConnect ? (
        <Button
          size="medium"
          style={styles.button}
          textType="boldCaption1"
          onPress={() => {
            if (isConnected) {
              navigation.navigate(Routes.KrakenConnectDisconnect, { selectedAccountNumber: accountNumber });
            } else {
              navigation.navigate(Routes.KrakenConnect, { selectedAccountNumber: accountNumber });
            }
          }}
          text={isConnected ? loc.krakenConnect.settings.disconnect : loc.krakenConnect.settings.connect}
          color={!isConnected ? 'kraken' : undefined}
        />
      ) : null}

      {showMenu ? (
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
          <IconButton name="more" onPress={noop} backgroundColor="light8" />
        </Menu>
      ) : null}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    marginRight: 12,
  },
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
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletInfo: {
    justifyContent: 'space-between',
  },
  button: {
    minWidth: 105,
  },
});
