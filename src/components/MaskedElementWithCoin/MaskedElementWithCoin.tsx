import type { StyleProp, ViewStyle } from 'react-native';

import React from 'react';
import { View } from 'react-native';

import { NetworkIcon } from '@/components/NetworkIcon';
import type { WalletType } from '@/onChain/wallets/registry';

import { ElementWithBadge } from '../ElementWithBadge/ElementWithBadge';

export type MaskedElementWithCoinProps = {
  size: number;
  maskedElement?: React.ReactElement;
  coinType: WalletType | 'walletTypeUnknown';
  coinSize: number;
  coinBorderSize?: number;

  coinPosition?: {
    top: number;
    left: number;
  };
  style?: StyleProp<ViewStyle>;
  maskShape?: 'circle' | 'rounded-square';
  testID?: string;
};

export const MaskedElementWithCoin: React.FC<MaskedElementWithCoinProps> = React.memo(
  ({
    size,
    coinSize,
    coinType,
    coinBorderSize = 2,
    coinPosition = {
      top: size - coinSize / 2,
      left: size - coinSize / 2,
    },
    maskedElement,
    maskShape = 'circle',
    style,
    testID,
  }) => {
    return (
      <View style={style} testID={testID}>
        <ElementWithBadge
          maskedElement={maskedElement}
          badgeElement={<NetworkIcon networkName={coinType} size={coinSize} />}
          size={size}
          badgeSize={coinSize}
          badegBorderSize={coinBorderSize}
          badgePosition={coinPosition}
          maskShape={maskShape}
        />
      </View>
    );
  },
);
