import { useHeaderHeight } from '@react-navigation/elements';
import { useMemo } from 'react';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

export const useDefaultSnapPoints = () => {
  const headerHeight = useHeaderHeight();
  const { height } = useSafeAreaFrame();

  return useMemo(() => {
    return [height - headerHeight - 309, height - headerHeight];
  }, [headerHeight, height]);
};
