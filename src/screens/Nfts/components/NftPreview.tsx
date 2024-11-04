import type { OnLoadEvent } from 'react-native-fast-image';

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import Animated, { FadeIn } from 'react-native-reanimated';

import { Label } from '@/components/Label';
import { SizeAwareSVGUri } from '@/components/SizeAwareSVGUri';
import { SvgIcon } from '@/components/SvgIcon';
import { useIsSvgImage } from '@/hooks/useIsSvgImage';

import loc from '/loc';

export type RawImageData = {
  width: number;
  height: number;
  isSvg?: boolean;
};

interface Props {
  uri: string;
  resizeMode?: 'contain' | 'cover';
  onLoad: (data: RawImageData) => void;
  contentType: string | null;
}

export const NftPreview = React.memo(({ uri, resizeMode = 'cover', contentType, onLoad }: Props) => {
  const isSvg = useIsSvgImage(uri, contentType);

  const [failedToLoad, setFailedToLoad] = useState(false);

  const onImageLoad = ({ nativeEvent }: OnLoadEvent) => {
    onLoad(nativeEvent);
  };

  const onSvgLoad = (layout: { width: number; height: number }) => {
    onLoad({ width: layout.width, height: layout.height, isSvg: true });
  };

  const onError = () => setFailedToLoad(true);

  if (failedToLoad) {
    return (
      <Animated.View entering={FadeIn} style={[StyleSheet.absoluteFill, styles.failedMediaContainer]}>
        <SvgIcon name="nft" size={64} color="light50" />
        <View style={styles.failedMediaLabels}>
          <Label type="boldTitle2">{loc.nftView.failedMedia.title}</Label>
          <Label type="regularCaption1" color="light50">
            {loc.nftView.failedMedia.desc}
          </Label>
        </View>
      </Animated.View>
    );
  }

  return isSvg ? (
    <SizeAwareSVGUri onError={onError} uri={uri} onLoad={onSvgLoad} fillContainer />
  ) : (
    <FastImage onError={onError} style={StyleSheet.absoluteFill} source={{ uri }} resizeMode={resizeMode} onLoad={onImageLoad} targetOriginalSize />
  );
});

const styles = StyleSheet.create({
  failedMediaContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  failedMediaLabels: {
    marginTop: 16,
    alignItems: 'center',
    gap: 4,
  },
});
