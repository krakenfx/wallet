import type { StyleProp, ViewStyle } from 'react-native';

import type { WalletType } from '@/onChain/wallets/registry';
import type { RealmWallet } from '@/realm/wallets';

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
