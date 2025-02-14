import type { StyleProp } from 'react-native';

import { useCallback, useMemo, useState } from 'react';
import FastImage, { type ImageStyle } from 'react-native-fast-image';

type UseKrakenAssetsIconOptions = {
  tokenAddress: string | null | undefined;
  style: StyleProp<ImageStyle>;
};

const krakenAssetsIconErrorCache = new Map<string, boolean>();

export const useKrakenAssetsIcon = (
  { tokenAddress, style }: UseKrakenAssetsIconOptions,
  enabled = true,
): {
  icon: JSX.Element | null;
  error: boolean;
} => {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
    tokenAddress && krakenAssetsIconErrorCache.set(tokenAddress, true);
  }, [setHasError, tokenAddress]);

  const cachedError = useMemo(() => tokenAddress && krakenAssetsIconErrorCache.get(tokenAddress), [tokenAddress]);

  const icon =
    enabled && tokenAddress && !hasError && !cachedError ? (
      <FastImage source={{ uri: `https://assets.kraken.com/marketing/wallet/address/${tokenAddress}.webp` }} style={style} onError={handleError} />
    ) : null;

  return { icon, error: hasError };
};
