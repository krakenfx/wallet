import type React from 'react';

import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

import { useAssetMetadata } from '@/realm/assetMetadata';
import { getNetworkNameFromAssetId } from '@/realm/tokens';

import { TokenIcon } from '../TokenIcon';

import { useFormattedPositionAmounts } from './useFormattedPositionAmounts';

import type { DefiProtocolPositionsRowProps } from './DefiProtocolPositions.types';

import loc from '/loc';

export const DefiProtocolPositionsRow: React.FC<DefiProtocolPositionsRowProps> = ({ position: { token, isDebt, apr } }) => {
  const { assetId, balance } = token;
  const networkName = getNetworkNameFromAssetId(assetId);
  const metadata = useAssetMetadata({ assetId });

  const { formattedFiatAmount, formattedTokenAmount } = useFormattedPositionAmounts({
    token: {
      assetId,
      balance,
      decimals: metadata?.decimals,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.metadataContainer}>
        <TokenIcon tokenId={assetId} tokenSymbol={metadata?.symbol} networkName={networkName} />

        <View style={styles.textContainer}>
          <Label type="boldTitle2" color="light100">
            {metadata?.label}
          </Label>

          <Label type="regularCaption1" color={isDebt ? 'yellow500' : 'green400'}>
            {isDebt ? `${loc.defi.debt} · ` : ''}
            {apr}% ${loc.defi.apr}
          </Label>
        </View>
      </View>

      <View style={styles.valueContainer}>
        <Label type="boldLargeMonospace" color="light100">
          {isDebt ? '-' : ''}
          {formattedFiatAmount}
        </Label>

        <Label type="regularCaption1" color="light50">
          {isDebt ? '-' : ''}
          {formattedTokenAmount} {metadata?.symbol}
        </Label>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  metadataContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  valueContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 1,
  },
});
