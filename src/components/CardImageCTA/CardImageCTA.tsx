import type { PropsWithChildren } from 'react';

import { Image, type ImageSourcePropType, type ImageStyle, StyleSheet, View, type ViewStyle } from 'react-native';

import { GradientItemBackground } from '../GradientItemBackground/GradientItemBackground';
import { Touchable } from '../Touchable';

type CardImageCTAProps = {
  onPress?: () => void;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  image: ImageSourcePropType;
  imageWidth?: number;
  imageHight?: number;
  imagePosition?: 'left' | 'right';
} & PropsWithChildren;

const DEFAULT_IMAGE_SIZE = 92;

export const CardImageCTA = ({
  onPress,
  image,
  imagePosition = 'left',
  children,
  imageWidth = DEFAULT_IMAGE_SIZE,
  imageHight = DEFAULT_IMAGE_SIZE,
  imageStyle,
  style,
}: CardImageCTAProps) => {
  const ImageContent = <Image style={[styles.image, { width: imageWidth, height: imageHight }, imageStyle]} source={image} />;

  return (
    <Touchable onPress={onPress}>
      <View style={[styles.container, style]}>
        <GradientItemBackground />
        {imagePosition === 'left' ? ImageContent : null}
        <View style={styles.content}>{children}</View>
        {imagePosition === 'right' ? ImageContent : null}
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  borderRadius: {
    borderRadius: 20,
  },
  content: {
    flexDirection: 'column',
    flex: 2,
  },
  image: {
    resizeMode: 'contain',
  },
});
