import type { FC } from 'react';

import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import { useTheme } from '@/theme/themes';

const IMG_SIZE = 40;
const IMG_SIZE_MEDIUM = 32;

interface DefiPositionImagesProps {
  images: string[];
}
export const DefiPositionImages: FC<DefiPositionImagesProps> = ({ images }) => {
  const { colors } = useTheme();
  const [imgUri, secondImgUri, ...otherImages] = images;
  const imgSize = useMemo(() => (secondImgUri ? IMG_SIZE_MEDIUM : IMG_SIZE), [secondImgUri]);

  const imgStyle = {
    borderRadius: imgSize / 2,
  };

  const renderCustomNumericalCircle = useCallback(
    ({ number }: { number: number }) => (
      <View
        key={Math.random()}
        style={[
          styles.collectionIconContainer,
          styles.numericContainer,
          { backgroundColor: colors.martinique, left: imgSize, zIndex: 2, height: imgSize, width: imgSize, borderRadius: imgSize / 2 },
        ]}>
        <Label type="boldCaption1" adjustsFontSizeToFit>
          +{number}
        </Label>
      </View>
    ),
    [colors.martinique, imgSize],
  );

  const containerWidth = secondImgUri ? (otherImages.length > 0 ? imgSize * 2 : imgSize * 1.5) : imgSize;

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <ImageSvg width={imgSize} height={imgSize} uri={imgUri} style={imgStyle} />
      {secondImgUri && <ImageSvg width={imgSize} height={imgSize} uri={secondImgUri} style={[imgStyle, styles.secondImg, { left: imgSize / 2 }]} />}
      {otherImages.length > 0 && renderCustomNumericalCircle({ number: otherImages.length })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  secondImg: {
    position: 'absolute',
    bottom: 0,
  },
  collectionIconContainer: {
    position: 'absolute',
    overflow: 'hidden',
  },
  numericContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
