import type React from 'react';

import { useCallback, useEffect, useState } from 'react';

import { StyleSheet, View } from 'react-native';
import FastImage, { type Source } from 'react-native-fast-image';

import { useNftById } from '@/realm/nfts';

import { ImageSvg } from '../ImageSvg';

import { AvatarIconWithOverlay } from './AvatarIconWithOverlay';
import { getDefaultAvatar } from './getDefaultAvatar';

import type { AvatarIconProps } from './AvatarIcon.types';

export const AvatarIcon: React.FC<AvatarIconProps> = ({ accountNumber, accountAvatar, avatarSize = 32, iconSize = 0 }) => {
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

  let avatar = <FastImage source={source} resizeMode={FastImage.resizeMode.contain} style={styles.image} onError={handleError} />;

  const nft = useNftById(accountAvatar ?? undefined);
  if (nft?.metadata?.imageUrl) {
    avatar = <ImageSvg uri={nft.metadata.imageUrl} contentType={nft.metadata.contentType} style={styles.image} />;
  }

  return (
    <View style={[styles.container, { height: avatarSize, width: avatarSize }]}>
      {iconSize > 0 ? <AvatarIconWithOverlay avatar={avatar} avatarSize={avatarSize} iconSize={iconSize} /> : avatar}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    borderRadius: 50,
    overflow: 'hidden',
  },
});
