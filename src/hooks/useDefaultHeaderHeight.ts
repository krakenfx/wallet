import { useMemo } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export const useDeafultHeaderHeight = (withTopInset = false) => {
  const insets = useSafeAreaInsets();

  return useMemo(() => Platform.select({ ios: 44, default: 56 }) + (withTopInset ? insets.top : 0), [insets.top, withTopInset]);
};
