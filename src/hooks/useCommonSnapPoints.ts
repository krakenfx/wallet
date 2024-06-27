import { HeaderHeightContext } from '@react-navigation/elements';
import { useContext, useMemo } from 'react';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { useDeafultHeaderHeight } from './useDefaultHeaderHeight';

type Variant = 'full' | 'toHeader' | 'toHeaderTransparent' | 'toHeaderAndMainContent';

export const useCommonSnapPoints = (variant: Variant) => {
  const defaultHeaderHeight = useDeafultHeaderHeight(true);
  const actualHeaderHeight = useContext(HeaderHeightContext) ?? 0;

  const { height } = useSafeAreaFrame();

  return useMemo(() => {
    switch (variant) {
      case 'toHeader':
        return [height - actualHeaderHeight];
      case 'toHeaderTransparent':
        return [height - defaultHeaderHeight];
      case 'toHeaderAndMainContent':
        return [height - actualHeaderHeight - 309, height - actualHeaderHeight];
      default:
        return [height];
    }
  }, [actualHeaderHeight, defaultHeaderHeight, height, variant]);
};
