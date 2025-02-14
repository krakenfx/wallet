import type { StyleProp } from 'react-native';
import type { ImageStyle } from 'react-native-fast-image';

import type { WalletType } from '@/onChain/wallets/registry';
import { getTokenIcon } from '@/utils/getTokenIcon';

type GetBundledTokenIconProps = {
  tokenSymbol?: string;
  tokenNetworkName: WalletType | string;
  style: StyleProp<ImageStyle>;
  size: number;
};

export const getBundledTokenIcon = ({ tokenSymbol, tokenNetworkName, style, size }: GetBundledTokenIconProps): JSX.Element | undefined => {
  const Icon = tokenSymbol ? getTokenIcon(tokenSymbol, tokenNetworkName) : undefined;

  return Icon && <Icon style={style} width={size} height={size} />;
};
