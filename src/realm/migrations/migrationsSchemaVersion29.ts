import Realm from 'realm';

import { DEFAULT_GALLERY_COINS, isNetworkCoin } from '@/onChain/wallets/registry';
import { REALM_TYPE_TOKEN, RealmToken } from '@/realm/tokens';



export const migrationsSchemaVersion29 = (oldRealm: Realm, newRealm: Realm) => {
  if (oldRealm.schemaVersion < 29) {
    const oldObjects = oldRealm.objects<RealmToken>(REALM_TYPE_TOKEN);
    const newObjects = newRealm.objects<RealmToken>(REALM_TYPE_TOKEN);

    for (const objectIndex in oldObjects) {
      if (!oldObjects[objectIndex].inGallery) {
        newObjects[objectIndex].inGallery = null;
      } else {
        const token = newObjects[objectIndex];
        if (isNetworkCoin(token.assetId) && DEFAULT_GALLERY_COINS.includes(token.wallet.type)) {
          token.inGallery = 'manuallyAdded';
        } else {
          token.inGallery = 'autoAdded';
        }
      }
    }
  }
};
