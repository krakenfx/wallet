import type { ViewToken } from 'react-native';

import { useCallback } from 'react';
import { useSharedValue } from 'react-native-reanimated';

export const useShowStickyHeader = () => {
  const showStickyHeader = useSharedValue(false);

  const onViewableItemsChanged = useCallback(
    ({ changed }: { changed: ViewToken[] }) => {
      const header = changed.find(item => item.key === 'deposit-options-carousel');
      if (header?.isViewable === false) {
        showStickyHeader.value = true;
      }

      if (header?.isViewable === true) {
        showStickyHeader.value = false;
      }
    },
    [showStickyHeader],
  );

  return {
    showStickyHeader,
    onViewableItemsChanged,
  };
};
