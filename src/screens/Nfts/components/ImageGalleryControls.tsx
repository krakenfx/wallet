import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { SharedValue, runOnJS, useAnimatedReaction, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { CloseButton } from '@/components/CloseButton';
import { SvgIcon } from '@/components/SvgIcon';
import { useDeafultHeaderHeight } from '@/hooks/useDefaultHeaderHeight';
import { RealmNft } from '@/realm/nfts';
import { useNftGalleryToggle } from '@/realm/nfts/useNftGalleryToggle';

import { NftCollectionDetails } from './NftCollectionDetails';
import { NftName } from './NftName';

import loc from '/loc';

type Props = {
  nft: RealmNft;
  onSendRequest: () => void;
  onClose: () => void;
  visibility: SharedValue<number>;
};

export const ImageGalleryControls: React.FC<Props> = ({ nft, onSendRequest, onClose, visibility }) => {
  const [touchEnabled, setTouchEnabled] = useState(!!visibility.value);
  const insets = useSafeAreaInsets();
  const headerHeight = useDeafultHeaderHeight();

  const style = useAnimatedStyle(() => ({
    opacity: visibility.value,
  }));

  const { toggleGallery, isInGallery } = useNftGalleryToggle(nft);

  useAnimatedReaction(
    () => !!visibility.value,
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setTouchEnabled)(current);
      }
    },
  );

  return (
    <Animated.View pointerEvents={touchEnabled ? 'box-none' : 'none'} style={[style, styles.overlay]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg viewBox="0 0 100 100" preserveAspectRatio="none" style={styles.gradient}>
          <Defs>
            <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0" stopColor="transparent" stopOpacity={0} />
              <Stop offset="1" stopColor="rgb(0, 0, 0)" stopOpacity={0.35} />
            </LinearGradient>
          </Defs>
          <Rect pointerEvents="none" x="0" y="0" width="100" height="100" fill="url(#gradient)" />
        </Svg>
      </View>
      <View style={[styles.header, { top: insets.top, height: headerHeight }]}>
        <CloseButton onPress={onClose} backgroundColor="dark15" />
      </View>
      <View pointerEvents="box-none" style={[styles.controls, { paddingBottom: 32 + insets.bottom }]}>
        <View pointerEvents="none" style={styles.heading}>
          <NftName nft={nft} containerStyle={styles.nftName} />
          <NftCollectionDetails nft={nft} />
        </View>
        {!nft.isArchived && (
          <View pointerEvents="box-none" style={styles.quickActions}>
            <SvgIcon
              testID="NftGalleryFavoriteBtn"
              onPress={toggleGallery}
              name={isInGallery ? 'star-filled' : 'star'}
              label={loc.nftGallery.favorite}
              style={styles.icon}
            />
            <SvgIcon testID="NftGallerySendBtn" onPress={onSendRequest} name="send" label={loc._.send} />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    height: '50%',
    top: '50%',
  },
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  icon: {
    marginVertical: 18,
  },
  heading: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  nftName: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  quickActions: {
    marginLeft: 16,
  },
  header: {
    position: 'absolute',
    right: 24,
    justifyContent: 'center',
  },
});
