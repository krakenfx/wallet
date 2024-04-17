import { useCallback } from 'react';

import { useRealm } from '@/realm/RealmContext';

import { RealmToken } from '../tokens';

export const useTokensGalleryMutations = () => {
  const realm = useRealm();

  const addTokenToGallery = useCallback(
    (token: RealmToken) => {
      realm.write(() => {
        token.inGallery = true;
      });
    },
    [realm],
  );

  const removeTokenFromGallery = useCallback(
    (token: RealmToken) => {
      realm.write(() => {
        token.inGallery = false;
      });
    },
    [realm],
  );

  return {
    addTokenToGallery,
    removeTokenFromGallery,
  };
};
