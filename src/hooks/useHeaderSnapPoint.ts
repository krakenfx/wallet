import { useHeaderHeight } from '@react-navigation/elements';
import { useMemo } from 'react';
import { useSafeAreaFrame } from 'react-native-safe-area-context';


export const useHeaderSnapPoint = (extraOffset = 8) => {
  const headerHeight = useHeaderHeight();
  const { height } = useSafeAreaFrame();

  return useMemo(() => {
    return [height - headerHeight - extraOffset];
  }, [extraOffset, headerHeight, height]);
};
