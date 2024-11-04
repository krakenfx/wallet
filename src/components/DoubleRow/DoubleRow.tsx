import type { StyleProp, ViewStyle } from 'react-native';

import MaskedView from '@react-native-masked-view/masked-view';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import Svg, { Circle, Defs, G, Mask, Rect } from 'react-native-svg';

import type { IconName } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';

type DoubleRowComponentProps = {
  containerStyle: StyleProp<ViewStyle>;
};

type Props = {
  renderTop: (props: DoubleRowComponentProps) => React.ReactElement;
  renderBottom: (props: DoubleRowComponentProps) => React.ReactElement;
  iconName: IconName;
  iconSize?: number;
  iconCircleSize?: number;
  iconCircleBorder?: number;
};

export const DoubleRow = ({ renderTop, renderBottom, iconName, iconSize = 16, iconCircleSize = 24, iconCircleBorder = 2 }: Props) => {
  return (
    <View>
      <MaskedView
        maskElement={
          <Svg>
            <Defs>
              <Mask id="squareWithHole" maskUnits="userSpaceOnUse">
                <Rect width="100%" height="100%" fill="white" />
                <Circle cx="50%" cy="50%" r={iconCircleSize / 2 + iconCircleBorder} fill="black" />
              </Mask>
            </Defs>
            <G mask={'url(#squareWithHole)'}>
              <Rect width="100%" height="100%" />
            </G>
          </Svg>
        }>
        <>
          {renderTop({ containerStyle: styles.containerTop })}
          {renderBottom({ containerStyle: styles.containerBottom })}
        </>
      </MaskedView>
      <View style={styles.iconContainer}>
        <SvgIcon
          size={iconSize}
          name={iconName}
          style={[
            styles.icon,
            {
              width: iconCircleSize,
              height: iconCircleSize,
              borderRadius: iconCircleSize / 2,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerTop: {
    borderRadius: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginBottom: 1,
  },
  containerBottom: {
    borderRadius: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: 1,
  },
  iconContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
