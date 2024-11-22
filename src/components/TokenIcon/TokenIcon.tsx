import type { StyleProp, ViewStyle } from 'react-native';

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { MaskedElementWithCoin } from '@/components/MaskedElementWithCoin';
import type { WalletType } from '@/onChain/wallets/registry';
import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import type { RealmWallet } from '@/realm/wallets';

import { NETWORK_ICON_BORDER_TO_TOKEN_RATIO, NETWORK_ICON_TO_TOKEN_RATIO } from './constants';
import { TokenIconFallback } from './TokenIconFallback';

import { getTokenIcon, getTokenIconFromNetworkName } from '/generated/assetIcons';

export type TokenIconProps = Partial<{
  forceOmitNetworkIcon?: boolean;
  forceNetworkIcon?: boolean;
  networkName: WalletType;
  size: number;
  style: StyleProp<ViewStyle>;
  testID: string;
  tokenId: string;
  tokenSymbol: string;
  wallet?: Pick<RealmWallet, 'nativeTokenLabel' | 'type'>;
}>;

export const omitNetworkIcons = {
  [ChainAgnostic.COIN_BITCOIN]: 'HDsegwitBech32',

  [ChainAgnostic.COIN_DOGECOIN]: 'dogecoin',

  [ChainAgnostic.COIN_ETHEREUM]: 'ethereum',

  [ChainAgnostic.COIN_POLYGON]: 'polygon',

  [ChainAgnostic.COIN_SOLANA]: 'solana',

  'eip155:42161/erc20:0x912ce59144191c1204e64559fe8253a0e49e6548': 'arbitrum',

  'eip155:10/erc20:0x4200000000000000000000000000000000000042': 'optimism',

  [ChainAgnostic.COIN_AVALANCHE]: 'avalanche',
};

export const TokenIcon = React.memo(
  ({ tokenId, tokenSymbol, wallet, style, size = 40, networkName, forceOmitNetworkIcon, forceNetworkIcon, testID }: TokenIconProps) => {
    const networkName_ = wallet?.nativeTokenLabel || networkName || '';
    const Source = useMemo(() => (tokenSymbol ? getTokenIcon(tokenSymbol) : getTokenIconFromNetworkName(networkName_)), [networkName_, tokenSymbol]);

    const isOnlyNetworkProvided = !!networkName && !tokenId && !tokenSymbol;
    const isInOmitNetworkIcons = wallet && wallet?.type === omitNetworkIcons[tokenId ?? ''];
    const omitNetworkIcon = !forceNetworkIcon && (isOnlyNetworkProvided || isInOmitNetworkIcons || forceOmitNetworkIcon);

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
  },
);

const styles = StyleSheet.create({
  ball: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '60%',
    height: '60%',
  },
});
