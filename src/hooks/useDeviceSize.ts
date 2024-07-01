import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

const MAX_SMALL_HEIGHT = 700;
const MIN_BIG_HEIGHT = 850;

type DeviceSize = 'small' | 'big' | 'standard';

export const useDeviceSize = () => {
  const { height } = useWindowDimensions();
  const size: DeviceSize = useMemo(() => {
    switch (true) {
      case height < MAX_SMALL_HEIGHT:
        return 'small';
      case height > MIN_BIG_HEIGHT:
        return 'big';
      default:
        return 'standard';
    }
  }, [height]);
  return {
    size,
    height,
  };
};
