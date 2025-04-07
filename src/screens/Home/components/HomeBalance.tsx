import { StyleSheet } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';

import { AnimatedNumbers } from '@/components/AnimatedNumbers';
import { IconButton } from '@/components/IconButton';
import { DEFAULT_MARGIN_TOP, LargeHeader, SMALL_DEVICE_MARGIN_TOP } from '@/components/LargeHeader';
import { Touchable } from '@/components/Touchable';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useDebounceEffect } from '@/hooks/useDebounceEffect';
import { useDeviceSize } from '@/hooks/useDeviceSize';
import { useAccountsMutations } from '@/realm/accounts';
import { useCurrentAccount } from '@/realm/accounts/useCurrentAccount';
import { useIsConnectedWithExchange } from '@/realm/krakenConnect/useIsConnectedWithExchange';
import { useIsHideBalancesEnabled, useSettingsMutations } from '@/realm/settings';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useTotalWalletBalance } from '@/realm/tokenPrice';

import { formatCurrency } from '@/utils/formatCurrency';

import { KRAKEN_CONNECT_BALANCE_FULL_HEIGHT, KRAKEN_CONNECT_BALANCE_FULL_HEIGHT_SMALL_DEVICE, KrakenConnectBalance } from './KrakenConnectBalance';
import { WaitForAccountSwitchSettled } from './WaitForAccountSwitchSettled';

import loc from '/loc';

const UPDATE_BALANCE_DEBOUNCE = 2000;

export const HomeBalance = () => {
  const { setHideBalances } = useSettingsMutations();
  const isHidden = useIsHideBalancesEnabled();
  const { currency } = useAppCurrency();
  const currentAccount = useCurrentAccount();
  const value = formatCurrency(currentAccount.balance, { currency, hideCurrencySign: true });
  const balanceDisplay = useBalanceDisplay(value, 6);
  const onLongPress = () => setHideBalances(!isHidden);
  const onPress = () => {
    if (!isHidden) {
      return;
    }
    setHideBalances(false);
  };

  const isConnectedWithExchange = useIsConnectedWithExchange();
  const { size } = useDeviceSize();
  const headerMarginTop = size === 'small' ? SMALL_DEVICE_MARGIN_TOP : DEFAULT_MARGIN_TOP;
  const headerFullHeight = size === 'small' ? KRAKEN_CONNECT_BALANCE_FULL_HEIGHT_SMALL_DEVICE : KRAKEN_CONNECT_BALANCE_FULL_HEIGHT;
  const headerStyle = isConnectedWithExchange ? { marginTop: Math.max(headerMarginTop - headerFullHeight, 0) } : {};
  return (
    <>
      <WaitForAccountSwitchSettled>
        <BalanceUpdater />
      </WaitForAccountSwitchSettled>
      <LargeHeader title={loc.home.total_balance} style={headerStyle}>
        <Touchable style={[isHidden && styles.touchable]} testID="TotalBalanceHeader" onLongPress={onLongPress} accessible={false} onPress={onPress}>
          <AnimatedNumbers
            type="headerBalance"
            value={balanceDisplay}
            ticker={isHidden ? '' : currency}
            fontSize={56}
            glyphSize={41}
            color={isHidden ? 'light50' : 'light100'}
            style={[isHidden && styles.asterisks]}
            testID="HeaderBalance"
          />
          {isHidden && (
            <Animated.View style={styles.iconButton} entering={ZoomIn} exiting={ZoomOut.duration(200)}>
              <IconButton name="eye-off" testID="HomeBalanceToggle" />
            </Animated.View>
          )}
        </Touchable>
      </LargeHeader>
      <KrakenConnectBalance />
    </>
  );
};

const BalanceUpdater = () => {
  const totalTokensAppCurrencyValue = useTotalWalletBalance();
  const { setCurrentAccountBalance } = useAccountsMutations();

  useDebounceEffect(
    () => {
      setCurrentAccountBalance(totalTokensAppCurrencyValue);
    },
    [totalTokensAppCurrencyValue],
    UPDATE_BALANCE_DEBOUNCE,
    { leading: true },
  );

  return null;
};

const styles = StyleSheet.create({
  touchable: {
    position: 'relative',
  },
  asterisks: {
    paddingTop: 12,
  },
  iconButton: {
    position: 'absolute',
    top: 12,
    left: 216,
  },
});
