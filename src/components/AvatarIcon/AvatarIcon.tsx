import React from 'react';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

import { getDefaultAvatar } from './getDefaultAvatar';

import type { AvatarIconProps } from './AvatarIcon.types';


export const AvatarIcon: React.FC<AvatarIconProps> = ({ accountNumber, accountAvatar }) => {
  const source = accountAvatar !== null ? { uri: accountAvatar } : getDefaultAvatar(accountNumber);
  return <FastImage source={source} resizeMode={FastImage.resizeMode.contain} style={styles.image} />;
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