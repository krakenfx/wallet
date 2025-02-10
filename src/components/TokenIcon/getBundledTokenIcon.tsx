import type { StyleProp } from 'react-native';
import type { ImageStyle } from 'react-native-fast-image';
import type { SvgProps } from 'react-native-svg';

import type { WalletType } from '@/onChain/wallets/registry';
import { getTokenIcon } from '@/utils/getTokenIcon';

import { getTokenIcon as oldGetTokenIcon, getTokenIconFromNetworkName as oldGetTokenIconFromNetworkName } from '/generated/assetIcons_old';

type GetBundledTokenIconProps = {
  isAssetV2Enabled: boolean;
  tokenSymbol?: string;
  tokenNetworkName: WalletType | string;
  style: StyleProp<ImageStyle>;
  size: number;
};

export const getBundledTokenIcon = ({ isAssetV2Enabled, tokenSymbol, tokenNetworkName, style, size }: GetBundledTokenIconProps): JSX.Element | undefined => {
  let Icon: React.FC<SvgProps> | undefined = undefined;

  if (isAssetV2Enabled) {
    Icon = tokenSymbol ? getTokenIcon(tokenSymbol, tokenNetworkName) : undefined;
  } else {
    Icon = tokenSymbol ? oldGetTokenIcon(tokenSymbol) : oldGetTokenIconFromNetworkName(tokenNetworkName);
  }

  return Icon && <Icon style={style} width={size} height={size} />;
};
