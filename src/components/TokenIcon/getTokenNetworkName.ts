import { type WalletType, networkIdToNetworkName } from '@/onChain/wallets/registry';
import { parseCAIP19 } from '@/onChain/wallets/utils/ChainAgnostic';
import type { RealmWallet } from '@/realm/wallets';

type GetTokenNetworkNameProps = {
  isAssetV2Enabled: boolean;
  networkName?: WalletType;
  wallet?: Pick<RealmWallet, 'nativeTokenLabel' | 'type'>;
  tokenId?: string;
};

const caip19NetworkByTokenId = (tokenId: string | null | undefined): WalletType | undefined => {
  const caip19 = parseCAIP19(tokenId || '');
  return caip19 ? networkIdToNetworkName[caip19.chainId] : undefined;
};

export const getTokenNetworkName = ({ isAssetV2Enabled, networkName, wallet, tokenId }: GetTokenNetworkNameProps): WalletType | string => {
  if (isAssetV2Enabled) {
    return networkName || caip19NetworkByTokenId(tokenId) || '';
  }

  return wallet?.nativeTokenLabel || networkName || '';
};
