import type { ImageSourcePropType } from 'react-native';

import type { WalletType } from '@/onChain/wallets/registry';

export type CardData = {
  assetId: string;
  assetSymbol: string;
  assetNetwork: WalletType;
  protocolIcon: ImageSourcePropType | undefined;
  protocolName: string;
  protocolApr: string;
};
