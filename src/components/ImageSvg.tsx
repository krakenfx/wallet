import React, { useCallback, useState } from 'react';
import { StyleProp, StyleSheet, View } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';
import { Image as RNSvgImage } from 'react-native-svg';

import { useIsSvgImage } from '@/hooks/useIsSvgImage';
import { useRefreshKey } from '@/hooks/useRefreshKey';
import { useTheme } from '@/theme/themes';

import { ErrorBoundary } from './ErrorBoundary';
import { SizeAwareSVGUri } from './SizeAwareSVGUri';
import { SvgIcon } from './SvgIcon';

interface ImageSvgProps {
  uri?: string | null;
  contentType?: string | null;
  fallbackIconSize?: number;
  width?: number;
  height?: number;
  testID?: string;
  style?: StyleProp<ImageStyle>;
  mask?: string;
  onSvgLoad?: () => void;
}

export const ImageSvg = ({ uri, contentType, width, height, testID, style, mask, onSvgLoad, fallbackIconSize }: ImageSvgProps) => {
  const isSvg = useIsSvgImage(uri, contentType);
  const [failedToLoad, setFailedToLoad] = useState(false);

  const onInvalidKey = useCallback(() => {
    setFailedToLoad(false);
  }, []);

  useRefreshKey(uri ?? '', onInvalidKey);

  const onError = () => setFailedToLoad(true);

  const { colors } = useTheme();

  if (failedToLoad || !uri) {
    return (
      <View style={[{ width, height }, style, styles.faileMediaContainer, { backgroundColor: colors.light8 }]} testID={testID}>
        <SvgIcon name="nft" size={fallbackIconSize} color="light50" />
      </View>
    );
  }

  return (
    <ErrorBoundary fallback={null}>
      {isSvg ? (
        <SizeAwareSVGUri
          onLoad={onSvgLoad}
          onError={onError}
          uri={uri}
          mask={mask}
          containerStyle={[{ width, height, backgroundColor: colors.light15 }, style]}
          width={width}
          height={height}
        />
      ) : mask ? (
        <RNSvgImage width={width} height={height} href={uri} mask={mask} />
      ) : (
        <FastImage onError={onError} style={[{ width, height }, style, { backgroundColor: colors.light15 }]} source={{ uri }} resizeMode="cover" />
      )}
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  faileMediaContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
