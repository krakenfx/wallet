import React, { memo, useMemo } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { SvgIcon } from '@/components/SvgIcon';
import { WalletType } from '@/onChain/wallets/registry';
import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import { RealmWallet } from '@/realm/wallets';
import { useTheme } from '@/theme/themes';

import { MaskedElementWithCoin } from './MaskedElementWithCoin';

import { getTokenIcon, getTokenIconFallbackProps, getTokenIconFromNetworkName } from '/generated/assetIcons';

export type TokenIconProps = Partial<{
  forceOmitNetworkIcon?: boolean;
  networkName: WalletType;
  size: number;
  style: StyleProp<ViewStyle>;
  testID: string;
  tokenId: string;
  tokenSymbol: string;
  wallet: RealmWallet;
}>;

export const omitNetworkIcons = {
  [ChainAgnostic.COIN_BITCOIN]: 'HDsegwitBech32',

  [ChainAgnostic.COIN_DOGECOIN]: 'dogecoin',

  [ChainAgnostic.COIN_ETHEREUM]: 'ethereum',

  [ChainAgnostic.COIN_POLYGON]: 'polygon',

  [ChainAgnostic.COIN_SOLANA]: 'solana',

  [ChainAgnostic.COIN_POCKET]: 'pocket',

  'eip155:42161/erc20:0x912ce59144191c1204e64559fe8253a0e49e6548': 'arbitrum',

  'eip155:10/erc20:0x4200000000000000000000000000000000000042': 'optimism',
};
const NETWORK_ICON_TO_TOKEN_RATIO = 2 / 5;
const NETWORK_ICON_BORDER_TO_TOKEN_RATIO = 1 / 20;

export const TokenIcon = React.memo(({ tokenId, tokenSymbol, wallet, style, size = 40, networkName, forceOmitNetworkIcon, testID }: TokenIconProps) => {
  const networkName_ = wallet?.nativeTokenLabel || networkName || '';
  const Source = useMemo(() => (tokenSymbol ? getTokenIcon(tokenSymbol) : getTokenIconFromNetworkName(networkName_)), [networkName_, tokenSymbol]);

  const isOnlyNetworkProvided = !!networkName && !tokenId && !tokenSymbol;
  const isInOmitNetworkIcons = wallet && wallet?.type === omitNetworkIcons[tokenId ?? ''];
  const omitNetworkIcon = isOnlyNetworkProvided || isInOmitNetworkIcons || forceOmitNetworkIcon;

  return (
    <MaskedElementWithCoin
      size={size}
      coinSize={omitNetworkIcon ? 0 : NETWORK_ICON_TO_TOKEN_RATIO * size}
      coinBorderSize={NETWORK_ICON_BORDER_TO_TOKEN_RATIO * size}
      coinType={wallet?.type ?? (networkName_ as WalletType) ?? 'walletTypeUnknown'}
      maskedElement={
        Source ? (
          <View style={[styles.ball, { width: size, height: size, borderRadius: size / 2 }, style]}>
            <Source style={styles.icon} width={size} height={size} />
          </View>
        ) : (
          <TokenIconFallback size={size} style={style} tokenSymbol={tokenSymbol ?? ''} />
        )
      }
      testID={testID}
    />
  );
});

export const ContractInteraction = ({ wallet, forceOmitNetworkIcon }: { wallet: RealmWallet; forceOmitNetworkIcon?: boolean }) => {
  const networkName_ = wallet.nativeTokenLabel || '';
  const size = 40;
  const { colors } = useTheme();

  return (
    <MaskedElementWithCoin
      size={size}
      coinSize={forceOmitNetworkIcon ? 0 : NETWORK_ICON_TO_TOKEN_RATIO * size}
      coinBorderSize={NETWORK_ICON_BORDER_TO_TOKEN_RATIO * size}
      coinType={wallet?.type ?? (networkName_ as WalletType) ?? 'walletTypeUnknown'}
      maskedElement={<SvgIcon name="sheet" style={[styles.sheetIcon, { backgroundColor: colors.light8 }]} gradientIconBackground />}
    />
  );
};

type TokenIconFallbackProps = { size: number; tokenSymbol: string; style?: StyleProp<ViewStyle>; testID?: string };
function arePropsEqual(oldProps: TokenIconFallbackProps, newProps: TokenIconFallbackProps) {
  return oldProps.tokenSymbol === newProps.tokenSymbol;
}
export const TokenIconFallback = memo(({ size, style, tokenSymbol, testID }: TokenIconFallbackProps) => {
  const { backgroundColor, label } = getTokenIconFallbackProps(tokenSymbol);

  return (
    <View style={[styles.ball, { backgroundColor, width: size, height: size, borderRadius: size / 2 }, style]} testID={testID}>
      <Text style={styles.tokenIconFallback} numberOfLines={1} allowFontScaling adjustsFontSizeToFit minimumFontScale={0.5}>
        {label}
      </Text>
    </View>
  );
}, arePropsEqual);

const styles = StyleSheet.create({
  ball: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '60%',
    height: '60%',
  },
  sheetIcon: {
    justifyContent: 'center',
    borderRadius: 20,
    height: 40,
    width: 40,
    marginRight: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  tokenIconFallback: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 2,
  },
});
