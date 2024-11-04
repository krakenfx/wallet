import { useObject } from '../RealmContext';

import { REALM_TYPE_NFT } from './schema';

import type { RealmNft } from './schema';

export const useNftById = <T extends string | undefined>(assetId: T) => {
  return useObject<RealmNft, T>(REALM_TYPE_NFT, assetId, 'assetId');
};
