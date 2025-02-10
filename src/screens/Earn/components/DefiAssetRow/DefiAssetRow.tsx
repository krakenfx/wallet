import type React from 'react';

import BigNumber from 'bignumber.js';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { TokenIcon } from '@/components/TokenIcon';

import { useTokenByAssetId } from '@/realm/tokens';
import { useWalletByAssetId } from '@/realm/wallets/useWalletByAssetId';

import { Sizes } from '../../EarnScreen.constants';

import type { DefiAssetRowProps } from './DefiAssetRow.types';

import loc from '/loc';

export const DefiAssetRow: React.FC<DefiAssetRowProps> = ({ asset, onSelect }) => {
  const { assetId, maxAPY } = asset;

  const wallet = useWalletByAssetId(assetId);
  const token = useTokenByAssetId(assetId, wallet.id);

  const visitEarnPage = () => onSelect(asset);

  return (
    <View style={styles.container}>
      <View style={styles.tokenMetadata}>
        <TokenIcon tokenId={assetId} tokenSymbol={asset.assetSymbol} wallet={wallet} />
        <View style={styles.tokenInfo}>
          <Label type="boldTitle2" color="light100" numberOfLines={1}>
            {asset.assetName}
          </Label>

          <Label type="regularCaption1" color="green400">
            {loc.formatString(loc.earn.earnUpToApy, { apy: maxAPY.toFixed(2) })}
          </Label>
        </View>
      </View>

      <Button
        text={loc.earn.earnCTA}
        size="medium"
        textType="boldBody"
        color={BigNumber(token?.balance || 0).isGreaterThan(0) ? 'kraken' : 'light8'}
        onPress={visitEarnPage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: Sizes.Space.s2,
  },
  tokenMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tokenInfo: {
    justifyContent: 'center',
    flexWrap: 'nowrap',
    maxWidth: 210,
  },
});
