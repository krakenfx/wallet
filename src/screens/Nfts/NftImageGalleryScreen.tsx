import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef } from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedReaction, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { GradientScreenView } from '@/components/Gradients';
import { useNftById } from '@/realm/nfts';
import { NavigationProps, Routes } from '@/Routes';
import { useTheme } from '@/theme/themes';
import { hapticFeedback } from '@/utils/hapticFeedback';

import { ImageGalleryControls } from './components/ImageGalleryControls';
import { NftImageGalleryItem, NftImageGalleryItemRef, PanDismiss } from './components/NftImageGalleryItem';
import { useGalleryTransiton } from './hooks/useGalleryTransition';
import { ViewNftRouteParams } from './ViewNftScreen';

export type TransitionConfig = {
  duration: number;
  initialDelay?: number;
  controlsDelay?: number;
  scales: {
    enter: number;
    exit: number;
  };
  borderRadius?: number;
  dismissScale?: number;
};

export interface NftImageGalleryRouteParams extends ViewNftRouteParams {
  transitionConfig: TransitionConfig;
  imageData: ReturnType<typeof useGalleryTransiton>['imageData'];
}

export const NftImageGalleryScreen = ({ navigation, route }: NavigationProps<'NftImageGallery'>) => {
  const nft = useNftById(route.params.assetId);
  const frame = useSafeAreaFrame();

  const screenEnter = useSharedValue(0);
  const screenLoaded = useSharedValue(false);
  const screenExit = useSharedValue(0);
  const panDismiss = useSharedValue(0);

  const controlsVisibility = useSharedValue(0);
  const backgroundColorTransition = useSharedValue(0);
  const screenExitOrPanDismiss = useSharedValue(0);

  const theme = useTheme();

  const galleryItemRef = useRef<NftImageGalleryItemRef>(null);

  const {
    imageData: { originalSize, containedSize, isSvg },
    transitionConfig,
  } = route.params;

  useEffect(() => {
    
    screenEnter.value = withDelay(
      transitionConfig.initialDelay ?? 0,
      withTiming(1, { duration: transitionConfig.duration }, finished => {
        if (finished) {
          screenLoaded.value = true;
        }
      }),
    );
    
    controlsVisibility.value = withDelay(transitionConfig.controlsDelay ?? 0, withTiming(1));
  }, [controlsVisibility, transitionConfig, screenEnter, screenLoaded]);

  
  useAnimatedReaction(
    () => {
      if (!screenExit.value && panDismiss.value === PanDismiss.NONE) {
        return screenEnter.value;
      }
      return (1 - screenExit.value) * interpolate(panDismiss.value, [PanDismiss.BEGIN, PanDismiss.END], [1, 0], Extrapolate.CLAMP);
    },
    transition => (backgroundColorTransition.value = transition),
  );

  
  useAnimatedReaction(
    () => {
      if (panDismiss.value === PanDismiss.FINISHED) {
        return 1;
      }
      if (panDismiss.value === PanDismiss.NONE) {
        return screenExit.value;
      }
      return Math.max(interpolate(panDismiss.value, [PanDismiss.NONE, PanDismiss.END], [0, 1], Extrapolate.CLAMP), screenExit.value);
    },
    transition => (screenExitOrPanDismiss.value = transition),
  );

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundColorTransition.value,
    backgroundColor: theme.colors.background,
  }));

  
  const scaleLimiterStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: interpolate(screenExitOrPanDismiss.value, [0, 1], [transitionConfig.scales.enter, transitionConfig.scales.exit]),
        },
      ],
    }),
    [containedSize, transitionConfig, screenLoaded.value],
  );

  
  const heightLimiterStyle = useAnimatedStyle(
    () => ({ height: interpolate(screenExit.value, [0, 1], [frame.height, containedSize.height]) }),
    [containedSize, screenLoaded.value, frame],
  );

  const goBack = () => {
    hapticFeedback.impactLight();
    navigation.goBack();
  };

  const onRequestClose = useCallback(() => {
    galleryItemRef.current?.dismissGallery();
  }, []);

  useEffect(() => {
    const handleBackButton = () => {
      onRequestClose();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [onRequestClose]);

  if (!nft) {
    return null;
  }

  const sendNft = () => {
    navigation.replace(Routes.SendStack, { screen: Routes.Send, params: { nftAssetId: nft.assetId } });
  };

  return (
    <Animated.View style={styles.flex} testID="NftImageGallery">
      <Animated.View style={[StyleSheet.absoluteFill, backgroundStyle]}>
        <GradientScreenView />
      </Animated.View>
      <Animated.View style={styles.container}>
        <Animated.View style={[scaleLimiterStyle, heightLimiterStyle, styles.borderRadiusConatiner]}>
          <NftImageGalleryItem
            ref={galleryItemRef}
            uri={nft.metadata.imageUrl}
            isSvg={isSvg}
            onClose={goBack}
            imageSize={originalSize}
            controlsVisibility={controlsVisibility}
            transitionConfig={transitionConfig}
            transitionValues={{
              screenExit,
              panDismiss,
              screenExitOrPanDismiss,
            }}
          />
        </Animated.View>
      </Animated.View>
      <ImageGalleryControls onClose={onRequestClose} nft={nft} onSendRequest={sendNft} visibility={controlsVisibility} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
  },
  borderRadiusConatiner: {
    borderRadius: 40,
    overflow: 'hidden',
  },
});

const navigationOptions: NativeStackNavigationOptions = {
  presentation: 'transparentModal',
  headerShown: false,
  animationDuration: 2000,
  animation: 'fade',
};

NftImageGalleryScreen.navigationOptions = navigationOptions;
