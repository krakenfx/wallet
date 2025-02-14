import MaskedView from '@react-native-masked-view/masked-view';

import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Mask } from 'react-native-svg';

import { TokenIcon } from '@/components/TokenIcon';

const IMG_SIZE = 28;

type Asset = { logoUrl: string | null; assetId: string; symbol: string } | undefined | null;

export interface Props {
  sentAsset?: Asset;
  receivedAsset?: Asset;
  testID?: string;
}

export function SwapIcon({ sentAsset, receivedAsset }: Props) {
  const size = 28;
  const coinSize = 30;
  const coinBorderSize = 1;

  const coinMaskPosition = {
    x: size - IMG_SIZE / 1.55 + coinSize / 2,
    y: size - IMG_SIZE / 1.7 + coinSize / 2,
  };

  return (
    <View style={styles.iconContainer}>
      <View style={styles.coin}>
        <MaskedView
          maskElement={
            <Svg>
              <Defs>
                <Mask id="moonShape" maskUnits="userSpaceOnUse">
                  <Circle x={size / 2} y={size / 2} r={size / 2} fill="white" />
                  <Circle {...coinMaskPosition} r={coinSize / 2 + coinBorderSize} fill="black" />
                </Mask>
              </Defs>
              <G mask={'url(#moonShape)'}>
                <Circle x={size / 2} y={size / 2} r={size / 2} />
              </G>
            </Svg>
          }>
          <TokenIcon tokenId={sentAsset?.assetId} tokenSymbol={sentAsset?.symbol} size={IMG_SIZE} forceOmitNetworkIcon />
        </MaskedView>
      </View>
      <View style={styles.iconSwapBottom}>
        <TokenIcon tokenId={receivedAsset?.assetId} tokenSymbol={receivedAsset?.symbol} size={IMG_SIZE} forceOmitNetworkIcon />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  coin: {
    marginRight: 8,
    position: 'absolute',
    borderRadius: IMG_SIZE / 2,
    width: IMG_SIZE,
    height: IMG_SIZE,
  },
  coin2: {
    marginRight: 8,
    position: 'absolute',
    bottom: -IMG_SIZE / 2,
    right: -IMG_SIZE / 1.3,
    borderRadius: IMG_SIZE / 2,
    width: IMG_SIZE,
    height: IMG_SIZE,
  },
  iconContainer: {
    width: IMG_SIZE / 1.1,
    height: IMG_SIZE / 1.1,
    position: 'relative',
    justifyContent: 'center',
    bottom: 5,
    marginRight: 15,
  },
  iconSwapBottom: {
    position: 'absolute',
    textTransform: 'uppercase',
    textAlign: 'center',
    bottom: -IMG_SIZE / 2,
    right: -IMG_SIZE / 2,
    borderRadius: IMG_SIZE / 2,
    width: IMG_SIZE,
    height: IMG_SIZE,
  },
});
