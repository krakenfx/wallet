import BottomSheetView, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { useRef } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { Extrapolate, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { FadingElement } from '@/components/FadingElement';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { GradientScreenView } from '@/components/Gradients';
import { IconButton } from '@/components/IconButton';
import { Label } from '@/components/Label';
import { useDeafultHeaderHeight } from '@/hooks/useDefaultHeaderHeight';
import { useNftById, useNftsMutations } from '@/realm/nfts';
import { useNftGalleryToggle } from '@/realm/nfts/useNftGalleryToggle';
import { NavigationProps, Routes } from '@/Routes';
import { useTheme } from '@/theme/themes';
import { hapticFeedback } from '@/utils/hapticFeedback';
import { useIsOnline } from '@/utils/useConnectionManager';

import loc from '../../../loc';
import navigationStyle from '../../components/navigationStyle';
import { showToast } from '../../components/Toast';

import { ArchiveBadge } from './components/ArchiveBadge';
import { ENSOwnership } from './components/ENSOwnership';
import { NftCollectionDetails } from './components/NftCollectionDetails';
import { ENSLinks, NFTLinks } from './components/NFTLinks';
import { NftName } from './components/NftName';
import { NftPreview } from './components/NftPreview';
import { NftTraits } from './components/NftTraits';
import { useGalleryTransiton } from './hooks/useGalleryTransition';

import { handleError } from '/helpers/errorHandler';

export interface ViewNftRouteParams {
  assetId: string;
}

const SEND_BUTTON_HIDDEN_OFFSET = 200;

export const ViewNftScreen = ({ navigation, route }: NavigationProps<'ViewNft'>) => {
  const assetId = route.params.assetId;
  const { colors } = useTheme();
  const isOnline = useIsOnline();
  const sheetRef = useRef<BottomSheetView>(null);

  const nft = useNftById(assetId);
  const { unArchiveNft } = useNftsMutations();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useSafeAreaFrame();

  const { toggleGallery, isInGallery } = useNftGalleryToggle(nft);

  const bottomSheetPosition = useSharedValue(0);
  const headerHeight = useDeafultHeaderHeight();
  const { imageData, onPreviewLoaded, transitionConfig } = useGalleryTransiton();

  useEffect(() => {
    if (!nft) {
      handleError("Internal error: can't find this NFT", 'ERROR_CONTEXT_PLACEHOLDER');
      navigation.goBack();
      return;
    }
  }, [navigation, nft]);

  const isInFocus = useIsFocused();
  const controlsVisibility = useSharedValue(1);
  const imagePreviewVisibity = useSharedValue(1);

  const handlePressBtn = useCallback(() => {
    if (nft.isArchived) {
      unArchiveNft(nft);
      showToast({ type: 'success', text: loc.nftManage.unArchiveSuccess });
    } else {
      navigation.navigate(Routes.SendStack, { screen: Routes.Send, params: { nftAssetId: nft.assetId } });
    }
  }, [unArchiveNft, navigation, nft]);

  const onManagePress = useCallback(() => {
    if (!nft) {
      return;
    }
    navigation.navigate(Routes.ManageNft, { id: nft.assetId });
  }, [navigation, nft]);

  const openGallery = () => {
    hapticFeedback.impactLight();
    navigation.navigate(Routes.NftImageGallery, {
      ...route.params,
      transitionConfig,
      imageData,
    });
    controlsVisibility.value = withTiming(0);
    imagePreviewVisibity.value = withDelay(
      transitionConfig.initialDelay ?? 0,
      withTiming(0, { duration: transitionConfig.duration }, () => {
        runOnJS(sheetRef.current?.snapToIndex!)(0);
      }),
    );

    sheetRef.current?.snapToPosition(1);
  };

  const onImageTap = () => {
    sheetRef.current?.close();
  };

  useEffect(() => {
    if (isInFocus) {
      imagePreviewVisibity.value = 1;
      controlsVisibility.value = withTiming(1);
    }
  }, [controlsVisibility, imagePreviewVisibity, isInFocus]);

  const bottomSheetSnapPoint = screenHeight - imageData.containedSize.height;

  const animatedHeaderStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(bottomSheetPosition.value, [0, imageData.containedSize.height, screenHeight], [0, 1, 0]) * controlsVisibility.value,
    }),
    [bottomSheetSnapPoint],
  );

  const floatingButtonStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: interpolate(
            bottomSheetPosition.value,
            [imageData.containedSize.height, screenHeight],
            [0, insets.bottom + SEND_BUTTON_HIDDEN_OFFSET],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }),
    [imageData.containedSize.height, screenHeight, insets.bottom],
  );

  const imageContainerStyle = useAnimatedStyle(() => {
    const { isTallPortrait, scales, containedSize, originalSize } = imageData;
    return {
      borderRadius: interpolate(bottomSheetPosition.value, [0, containedSize.height, screenHeight], [40, 40, 0]),
      height: interpolate(
        bottomSheetPosition.value,
        [0, containedSize.height, screenHeight],
        [containedSize.height, containedSize.height, originalSize.height],
      ),
      opacity: imagePreviewVisibity.value,
      transform: [
        {
          translateY: interpolate(
            bottomSheetPosition.value,
            [0, containedSize.height, screenHeight],
            [0, 0, screenHeight / 2 - originalSize.height / 2],
            Extrapolate.CLAMP,
          ),
        },
        {
          scale: interpolate(bottomSheetPosition.value, [0, containedSize.height, screenHeight], [1, 1, 1 / (isTallPortrait ? scales.fitToHeight : 1)]),
        },
      ],
    };
  }, [screenHeight, imageData]);

  if (!nft) {
    return null;
  }

  return (
    <GradientScreenView>
      <TouchableWithoutFeedback onPress={onImageTap} disabled={!imageData.isReady} testID="NftImageItem">
        <Animated.View style={[styles.imageWrapper, imageData.containedSize, imageData.isReady && imageContainerStyle]}>
          {!imageData.isReady && <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.light8 }]} />}
          <NftPreview uri={nft.metadata.imageUrl} resizeMode="cover" onLoad={onPreviewLoaded} contentType={nft.metadata.contentType} />
        </Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.navigationHeader, animatedHeaderStyle, { marginTop: insets.top, height: headerHeight }]}>
        <BackButton blurred backgroundColor="dark15" />
        {!!nft.archivedAt && nft.isValid() && <ArchiveBadge archiveDate={nft.archivedAt} />}
        <View style={styles.rightIconContainer}>
          {!nft.isArchived && (
            <IconButton testID="TopFavoriteButton" blurred onPress={toggleGallery} name={isInGallery ? 'star-filled' : 'star'} backgroundColor="dark15" />
          )}
        </View>
      </Animated.View>
      <BottomSheet
        animateOnMount={false}
        noBackdrop
        ref={sheetRef}
        dismissible={imageData.isReady}
        snapPoints={[bottomSheetSnapPoint, screenHeight]}
        animatedPosition={bottomSheetPosition}
        onDismiss={openGallery}>
        <NftName nft={nft} containerStyle={styles.nameContainer} testID="NftName" />
        <FadingElement containerStyle={styles.fadingElement}>
          <BottomSheetScrollView contentContainerStyle={styles.sheetScrollContainer}>
            <View style={styles.subHeaderRow}>
              <NftCollectionDetails nft={nft} />
              <Button text={loc.nftView.manage} onPress={onManagePress} testID="ManageButton" />
            </View>
            {nft.metadata.isENS && <ENSOwnership nft={nft} />}
            <NftTraits nft={nft} />
            {!!nft.metadata.description && (
              <>
                <Label type="boldTitle2" style={styles.sectionHeading}>
                  {loc.nftView.about}
                </Label>
                <Label type="regularBody">{nft.metadata.description}</Label>
              </>
            )}

            {nft.metadata.isENS ? (
              <>
                <Label type="regularBody">{`\n${loc.nftView.ens.description}`}</Label>
                <Label style={styles.sectionHeading}>{loc.nftView.links.label}</Label>
                <ENSLinks nft={nft} />
              </>
            ) : (
              <>
                <Label style={styles.sectionHeading}>{loc.nftView.links.label}</Label>
                <NFTLinks nft={nft} walletType={nft.wallet.type} />
              </>
            )}
          </BottomSheetScrollView>
        </FadingElement>
      </BottomSheet>
      <FloatingBottomButtons
        style={floatingButtonStyle}
        primary={{
          testID: nft.isArchived ? 'ArchiveNftButton' : 'SendNftButton',
          disabled: !nft.isArchived && !isOnline,
          text: nft.isArchived ? loc.nftManage.unArchive : loc._.send,
          onPress: handlePressBtn,
        }}
      />
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  navigationHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  rightIconContainer: {
    width: 32,
  },
  nameContainer: {
    marginVertical: 8,
    marginHorizontal: 24,
    flexDirection: 'row',
  },
  sheetScrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 160,
  },
  imageWrapper: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  sectionHeading: {
    marginTop: 32,
    marginBottom: 16,
  },
  traitsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginBottom: 8,
  },
  traitWrapper: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 8,
    height: 75,
    marginHorizontal: 4,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  traitsShowMore: {
    marginTop: 24,
  },
  fadingElement: {
    flex: 1,
  },
});

ViewNftScreen.navigationOptions = navigationStyle({
  headerShown: false,
});
