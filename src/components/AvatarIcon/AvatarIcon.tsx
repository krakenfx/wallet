import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import FastImage, { type Source } from 'react-native-fast-image';

import { useNftById } from '@/realm/nfts';

import { ImageSvg } from '../ImageSvg';

import { getDefaultAvatar } from './getDefaultAvatar';

import type { AvatarIconProps } from './AvatarIcon.types';

export const AvatarIcon: React.FC<AvatarIconProps> = ({ accountNumber, accountAvatar }) => {
  const getImageSource = useCallback(
    (): Source => (accountAvatar !== null ? { uri: accountAvatar } : getDefaultAvatar(accountNumber)),
    [accountNumber, accountAvatar],
  );

  const [source, setSource] = useState(getImageSource());

  useEffect(() => {
    setSource(getImageSource());
  }, [getImageSource]);

  const handleError = () => {
    setSource(getDefaultAvatar(accountNumber));
  };

  
  
  const nft = useNftById(accountAvatar ?? undefined);
  if (nft?.metadata?.imageUrl) {
    return <ImageSvg uri={nft.metadata.imageUrl} contentType={nft.metadata.contentType} style={styles.image} />;
  }

  return <FastImage source={source} resizeMode={FastImage.resizeMode.contain} style={styles.image} onError={handleError} />;
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    borderRadius: 50,
    overflow: 'hidden',
  },
});
