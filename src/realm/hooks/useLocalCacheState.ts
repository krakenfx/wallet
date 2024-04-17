import { useCallback, useState } from 'react';

import { useRefreshKey } from '@/hooks/useRefreshKey';

export const useLocalCacheState = (itemId?: string) => {
  const [shouldUseCache, setShouldUseCache] = useState(false);

  const onRefreshKeyInvalid = useCallback(() => {
    if (shouldUseCache) {
      setShouldUseCache(false);
    }
  }, [shouldUseCache]);

  useRefreshKey(itemId, onRefreshKeyInvalid);

  return {
    setShouldUseCache,
  };
};
