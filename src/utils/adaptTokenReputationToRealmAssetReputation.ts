import type { TokenReputation } from '@/api/types';
import type { AssetReputation } from '@/realm/assetMetadata';


export const adaptTokenReputationToRealmAssetReputation = (tr?: TokenReputation | AssetReputation): AssetReputation => {
  if (!tr) {
    return {
      whitelists: [],
      blacklists: [],
    };
  }

  
  if ('whitelists' in tr) {
    return tr;
  }

  return {
    whitelists: 'tokenLists' in tr ? tr.tokenLists : [],
    blacklists: 'blacklists' in tr ? tr.blacklists : [],
  };
};
