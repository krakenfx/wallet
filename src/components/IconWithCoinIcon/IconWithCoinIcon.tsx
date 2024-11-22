import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Defs, G, Mask, Circle as RNCircle, Rect, Svg } from 'react-native-svg';

import { ImageSvg } from '@/components/ImageSvg';
import { NetworkIcon } from '@/components/NetworkIcon';
import type { WalletType } from '@/onChain/wallets/registry';

const CIRCLE = 'circle';
const COIN_BORDER_SIZE = 2;
const COIN_SIZE = 16;
const ROUNDED_SQUARE = 'rounded-square';
const SIZE = 48;
const WHITE = 'white';
const DEFAULT_MASK_POSITION_XY_NUDGE = 0;

export interface Props {
  children?: React.ReactNode | React.ReactNode[];
  coinSize?: number;
  coinType?: WalletType;
  maskShape?: typeof CIRCLE | typeof ROUNDED_SQUARE;
  maskPositionXYNudge?: number;
  icon?: JSX.Element;
  iconUri?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const BigCircle = ({ fill = WHITE, size = SIZE }: Pick<Props, 'size'> & { fill?: string }) => {
  const bigCircleRadius = size / 2;

  return <RNCircle x={bigCircleRadius} y={bigCircleRadius} r={bigCircleRadius} fill={fill} />;
};

const SmallCircle = ({
  coinSize = COIN_SIZE,
  fill = WHITE,
  size = SIZE,
  maskPositionXYNudge = DEFAULT_MASK_POSITION_XY_NUDGE,
}: Pick<Props, 'coinSize' | 'size'> & { fill?: string; maskPositionXYNudge?: number }) => {
  const smallCircleXY = size - coinSize / 2 - (maskPositionXYNudge ? coinSize / maskPositionXYNudge : 0);
  const smallCircleRadius = coinSize / 2 + COIN_BORDER_SIZE;

  return <RNCircle x={smallCircleXY} y={smallCircleXY} r={smallCircleRadius} fill={fill} />;
};

const RoundedSquare = ({ fill = WHITE, size = SIZE }: Pick<Props, 'size'> & { fill?: string }) => {
  const reductionScale = 16;
  const startXY = size / reductionScale;
  const reducedSize = startXY * (reductionScale - 2);
  const radius = '35%';

  return <Rect x={startXY} y={startXY} width={reducedSize} height={reducedSize} rx={radius} fill={fill} />;
};

export const IconWithCoinIcon = ({ icon, coinSize = COIN_SIZE, coinType, iconUri, maskPositionXYNudge, maskShape = CIRCLE, size = SIZE, style }: Props) => {
  const [isSvgLoaded, setIsSvgLoaded] = useState(false);

  return (
    <View style={[{ ...styles.container, width: size, height: size }, style]}>
      {icon}
      <Svg width={size} height={size} style={{ ...styles.collectionIconWrapper, borderRadius: size / 2 }}>
        <Defs>
          <Mask id="clip" maskUnits="userSpaceOnUse">
            {maskShape === CIRCLE && <BigCircle size={size} />}
            {maskShape === ROUNDED_SQUARE && <RoundedSquare size={size} />}
            {coinType && <SmallCircle coinSize={coinSize} fill="black" size={size} maskPositionXYNudge={maskPositionXYNudge} />}
          </Mask>
        </Defs>
        {}
        {!isSvgLoaded && (
          <G mask="url(#clip)">
            {maskShape === CIRCLE && <BigCircle fill="rgba(255, 255, 255, 0.15)" size={size} />}
            {maskShape === ROUNDED_SQUARE && <RoundedSquare fill="rgba(255, 255, 255, 0.15)" size={size} />}
          </G>
        )}
        {!icon && (
          <ImageSvg
            onSvgLoad={() => setIsSvgLoaded(true)}
            uri={iconUri || ''}
            width={size}
            height={size}
            mask="url(#clip)"
            style={{ ...styles.img, ...(maskShape === CIRCLE && { borderRadius: size / 2 }) }}
          />
        )}
      </Svg>
      {coinType && (
        <NetworkIcon
          networkName={coinType}
          style={[
            styles.coinContainer,
            {
              bottom: maskPositionXYNudge ? coinSize / maskPositionXYNudge : 0,
              right: maskPositionXYNudge ? coinSize / maskPositionXYNudge : 0,
            },
          ]}
          size={coinSize}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  collectionIconWrapper: {
    position: 'absolute',
    overflow: 'hidden',
  },
  img: {
    overflow: 'hidden',
  },
  smallCircle: {
    bottom: 0,
    right: 0,
  },
});
