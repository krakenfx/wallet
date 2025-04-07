import BigNumber from 'bignumber.js';
import { StyleSheet, View } from 'react-native';

import type { Position } from '@/components/DefiProtocolPositions/DefiProtocolPositions.types';
import { useTheme } from '@/theme/themes';

import { DefiDetailsInfoCompositionItem } from './DefiDetailsInfoCompositionItem';

type Props = {
  position: Position;
};

export const DefiDetailsInfoComposition = ({ position }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.dark15 }]}>
      {position.assets.map(({ decimals, symbol, id, balanceNative, balanceUsd, portion }) => {
        const balanceNative_ = position.isDebt ? BigNumber(balanceNative).multipliedBy(-1).toString(10) : balanceNative;

        return (
          <DefiDetailsInfoCompositionItem
            tokenDecimals={decimals}
            tokenSymbol={symbol}
            tokenId={id}
            balanceNative={balanceNative_}
            balanceUsd={balanceUsd}
            ratio={portion}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
