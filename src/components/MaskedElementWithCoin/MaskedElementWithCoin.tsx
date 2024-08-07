import MaskedView from '@react-native-masked-view/masked-view';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, G, Mask, Rect } from 'react-native-svg';

import { NetworkIcon } from '@/components/NetworkIcon';
import { WalletType } from '@/onChain/wallets/registry';

type Props = {
  size: number;
  maskedElement?: React.ReactElement;
  coinType: WalletType | 'walletTypeUnknown';
  coinSize: number;
  coinBorderSize?: number;

  coinPosition?: {
    top: number;
    left: number;
  };
  style?: StyleProp<ViewStyle>;
  maskShape?: 'circle' | 'rounded-square';
  testID?: string;
};

const RoundedSquare = ({ fill = 'white', size }: Pick<Props, 'size'> & { fill?: string }) => {
  const reductionScale = 16;
  const startXY = size / reductionScale;
  const reducedSize = startXY * (reductionScale - 2);
  const radius = '35%';

  return <Rect x={startXY} y={startXY} width={reducedSize} height={reducedSize} rx={radius} fill={fill} />;
};

export const MaskedElementWithCoin: React.FC<Props> = React.memo(
  ({
    size,
    coinSize,
    coinType,
    coinBorderSize = 2,
    coinPosition = {
      top: size - coinSize / 2,
      left: size - coinSize / 2,
    },
    maskedElement,
    maskShape = 'circle',
    style,
    testID,
  }) => {
    const coinMaskPosition = { x: coinPosition.left, y: coinPosition.top };
    const coinStyle = { top: coinPosition.top - coinSize / 2, left: coinPosition.left - coinSize / 2 };
    return (
      <View style={style} testID={testID}>
        <MaskedView
          maskElement={
            <Svg>
              <Defs>
                <Mask id="moonShape" maskUnits="userSpaceOnUse">
                  {maskShape === 'circle' && (
                    <>
                      <Circle x={size / 2} y={size / 2} r={size / 2} fill="white" />
                      <Circle {...coinMaskPosition} r={coinSize / 2 + coinBorderSize} fill="black" />
                    </>
                  )}
                  {maskShape === 'rounded-square' && (
                    <>
                      <RoundedSquare size={size} />
                      <Circle {...coinMaskPosition} r={coinSize / 2 + coinBorderSize} fill="black" />
                    </>
                  )}
                </Mask>
              </Defs>
              <G mask={'url(#moonShape)'}>
                <Circle x={size / 2} y={size / 2} r={size / 2} />
              </G>
            </Svg>
          }>
          {maskedElement}
        </MaskedView>
        {coinSize > 0 && <NetworkIcon networkName={coinType} size={coinSize} style={[styles.coin, coinStyle]} />}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  coin: {
    position: 'absolute',
  },
});
