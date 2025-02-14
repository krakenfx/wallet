import { type WalletType, networkIdToNetworkName } from '@/onChain/wallets/registry';
import { parseCAIP19 } from '@/onChain/wallets/utils/ChainAgnostic';

type GetTokenNetworkNameProps = {
  networkName?: WalletType;
  tokenId?: string;
};

const caip19NetworkByTokenId = (tokenId: string | null | undefined): WalletType | undefined => {
  const caip19 = parseCAIP19(tokenId || '');
  return caip19 ? networkIdToNetworkName[caip19.chainId] : undefined;
};

export const getTokenNetworkName = ({ networkName, tokenId }: GetTokenNetworkNameProps): WalletType | string => {
  return networkName || caip19NetworkByTokenId(tokenId) || '';
};
