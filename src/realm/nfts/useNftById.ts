import { useObject } from '../RealmContext';

import { REALM_TYPE_NFT, RealmNft } from './schema';

export const useNftById = <T extends string | undefined>(assetId: T) => {
  return useObject<RealmNft, T>(REALM_TYPE_NFT, assetId, 'assetId');
};
