import type { StyleProp } from 'react-native';

import { useCallback, useState } from 'react';
import FastImage, { type ImageStyle } from 'react-native-fast-image';

type UseLogoUrlAssetsIconOptions = {
  isAssetV2Enabled: boolean;
  logoUrl: string | null | undefined;
  style: StyleProp<ImageStyle>;
};

export const useLogoUrlAssetsIcon = (
  { isAssetV2Enabled, logoUrl, style }: UseLogoUrlAssetsIconOptions,
  enabled = true,
): {
  icon: JSX.Element | null;
  error: boolean;
} => {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, [setHasError]);

  const icon = enabled && isAssetV2Enabled && logoUrl && !hasError ? <FastImage source={{ uri: logoUrl }} style={style} onError={handleError} /> : null;

  return { icon, error: hasError };
};
