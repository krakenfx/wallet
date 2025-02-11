import type { StyleProp, ViewStyle } from 'react-native';

import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg from 'react-native-svg';

import { SvgIcon } from '@/components/SvgIcon';
import type { WalletType } from '@/onChain/wallets/registry';

import { useTheme } from '@/theme/themes';

import { getNetworkIcon } from '/generated/networkIcons';

type Props = {
  networkName: WalletType | 'walletTypeUnknown' | 'selectNetwork';
  size: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export const NetworkIcon = ({ networkName, size = 40, style, testID }: Props) => {
  const stylesHook = useMemo(
    () =>
      StyleSheet.create({
        ball: {
          width: size,
          height: size,
        },
      }),
    [size],
  );

  const NetworkIconSvg = useMemo(() => {
    return getNetworkIcon(networkName) ?? (() => null);
  }, [networkName]);

  const { colors } = useTheme();

  const padding = 8;

  return (
    <View style={[styles.ball, stylesHook.ball, style]} testID={testID}>
      {networkName !== 'selectNetwork' ? (
        <Svg viewBox="0 0 250 250" width={size} height={size}>
          <NetworkIconSvg />
        </Svg>
      ) : (
        <View style={[styles.ball, { backgroundColor: colors.light8, height: size, width: size }]}>
          <SvgIcon name="chain" size={size - padding} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ball: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
