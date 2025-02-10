import type { StyleProp, ViewStyle } from 'react-native';

import MaskedView from '@react-native-masked-view/masked-view';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Mask, Rect } from 'react-native-svg';

export type ElementWithBadgeProps = {
  size: number;
  maskedElement?: React.ReactElement;
  badgeElement?: React.ReactElement | undefined | null;
  badgeSize: number;
  badegBorderSize?: number;

  badgePosition?: {
    top: number;
    left: number;
  };
  style?: StyleProp<ViewStyle>;
  maskShape?: 'circle' | 'rounded-square';
  testID?: string;
};

const RoundedSquare = ({ fill = 'white', size }: Pick<ElementWithBadgeProps, 'size'> & { fill?: string }) => {
  const reductionScale = 16;
  const startXY = size / reductionScale;
  const reducedSize = startXY * (reductionScale - 2);
  const radius = '35%';

  return <Rect x={startXY} y={startXY} width={reducedSize} height={reducedSize} rx={radius} fill={fill} />;
};

export const ElementWithBadge: React.FC<ElementWithBadgeProps> = React.memo(
  ({
    badgeElement,
    size,
    badgeSize,
    badegBorderSize = 2,
    badgePosition = {
      top: size - badgeSize / 2,
      left: size - badgeSize / 2,
    },
    maskedElement,
    maskShape = 'circle',
    style,
    testID,
  }) => {
    const badgeMaskPosition = { x: badgePosition.left, y: badgePosition.top };
    const badgeStyle = { top: badgePosition.top - badgeSize / 2, left: badgePosition.left - badgeSize / 2 };
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
                      <Circle {...badgeMaskPosition} r={badgeSize / 2 + badegBorderSize} fill="black" />
                    </>
                  )}
                  {maskShape === 'rounded-square' && (
                    <>
                      <RoundedSquare size={size} />
                      <Circle {...badgeMaskPosition} r={badgeSize / 2 + badegBorderSize} fill="black" />
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
        {badgeElement && badgeSize > 0 && <View style={[styles.coin, badgeStyle]}>{badgeElement}</View>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  coin: {
    position: 'absolute',
  },
});
