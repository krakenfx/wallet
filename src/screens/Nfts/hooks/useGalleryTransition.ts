import { clamp } from 'lodash';
import { useMemo, useState } from 'react';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import { RawImageData } from '../components/NftPreview';
import { TransitionConfig } from '../NftImageGalleryScreen';

const MIN_PREVIEW_RATIO = 3 / 4;
const MAX_PREVIEW_RATIO = 16 / 9;
const DEFAULT_PREVIEW_RATIO = 1;

export const useGalleryTransiton = () => {
  const [rawData, setRawData] = useState<RawImageData>();

  const { width: screenWidth, height: screenHeight } = useSafeAreaFrame();

  const imageData = useMemo(() => {
    const originalRatio = rawData ? rawData.width / rawData.height : DEFAULT_PREVIEW_RATIO;
    const ratio = clamp(originalRatio, MIN_PREVIEW_RATIO, MAX_PREVIEW_RATIO);

    const imageHeight = screenWidth / ratio;
    const originalHeight = screenWidth / originalRatio;
    const fitToWidthScale = imageHeight / originalHeight;
    const fitToHeightScale = originalHeight / screenHeight;

    const isPortrait = originalHeight >= screenWidth;
    const isTallPortrait = originalHeight > screenHeight;

    const isSvg = rawData?.isSvg;

    const originalSize = {
      height: originalHeight,
      width: screenWidth,
    };

    const containedSize = {
      height: imageHeight,
      width: screenWidth,
    };

    return {
      isReady: !!rawData,
      isSvg,
      originalSize,
      containedSize,
      isPortrait,
      isTallPortrait,
      scales: {
        fitToWidth: fitToWidthScale,
        fitToHeight: fitToHeightScale,
      },
    };
  }, [rawData, screenHeight, screenWidth]);

  const scales = useMemo(() => {
    const {
      isPortrait,
      isTallPortrait,
      scales: { fitToHeight, fitToWidth },
    } = imageData;
    return {
      enter: 1,
      exit: isPortrait ? (isTallPortrait ? fitToHeight : 1) : fitToWidth,
    };
  }, [imageData]);

  const transitionConfig: TransitionConfig = {
    scales,
    borderRadius: 40,
    initialDelay: 200,
    duration: 300,
    dismissScale: 0.95,
  };

  return {
    imageData,
    onPreviewLoaded: setRawData,
    transitionConfig,
  };
};
