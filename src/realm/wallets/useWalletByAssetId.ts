import { keyBy } from 'lodash';

import { getNetworkNameFromAssetId } from '@/realm/tokens';
import { useRealmWallets } from '@/realm/wallets';

export const useWalletByAssetId = (assetId: string) => {
  const realmWallets = useRealmWallets();
  const wallets = keyBy(Array.from(realmWallets), 'type');
  const networkName = getNetworkNameFromAssetId(assetId);
  const wallet = wallets[networkName];
  return wallet;
};
