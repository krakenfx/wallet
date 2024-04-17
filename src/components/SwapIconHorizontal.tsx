import MaskedView from '@react-native-masked-view/masked-view';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Mask } from 'react-native-svg';

import { TokenIcon } from '@/components/TokenIcon';

export interface Props {
  sentAssetSymbol: string;
  receivedAssetSymbol: string;
  size?: number;
  testID?: string;
}

const ICON_SIZE = 16;
const SENT_ASSET_HIDDEN_SIZE = 1 / 2.5;
const RECEIVED_ASSET_LEFT_PADDING = 1 / 6;

export const SwapIconHorizontal = memo(({ sentAssetSymbol, receivedAssetSymbol, size = ICON_SIZE }: Props) => {
  return (
    <View style={styles.container}>
      <MaskedView
        maskElement={
          <Svg>
            <Defs>
              <Mask id="moonShape" maskUnits="userSpaceOnUse">
                <Circle x={size / 2} y={size / 2} r={size / 2} fill="white" />
                <Circle x={size / 2 + (size - SENT_ASSET_HIDDEN_SIZE * size)} y={size / 2} r={size / 2} fill="black" />
              </Mask>
            </Defs>
            <G mask={'url(#moonShape)'}>
              <Circle x={size / 2} y={size / 2} r={size / 2} />
            </G>
          </Svg>
        }>
        <TokenIcon tokenSymbol={sentAssetSymbol} size={size} forceOmitNetworkIcon />
      </MaskedView>
      <View style={{ left: size * SENT_ASSET_HIDDEN_SIZE * -1 + size * RECEIVED_ASSET_LEFT_PADDING }}>
        <TokenIcon tokenSymbol={receivedAssetSymbol} size={size} forceOmitNetworkIcon />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
