import { useCallback } from 'react';

import { fetchTokenMetadata } from '@/api/fetchTokenMetadata';

import { useAssetMetadataMutations } from './useAssetMetadataMutations';

export const useAssetMetadataFetch = (assetId?: string) => {
  const { setAssetItemMetadata } = useAssetMetadataMutations();

  const fetchAndSetData = useCallback(async () => {
    if (assetId) {
      const data = await fetchTokenMetadata(assetId!);
      if (data) {
        setAssetItemMetadata(data);
      }
    }
  }, [assetId, setAssetItemMetadata]);

  return {
    fetchAndSetData,
  };
};
