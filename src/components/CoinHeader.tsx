import React from 'react';
import { StyleSheet, View } from 'react-native';

import { getImplForWallet } from '@/onChain/wallets/registry';
import { useResolvedAssetBalance, useTokenById } from '@/realm/tokens';
import { useRealmWalletById } from '@/realm/wallets';
import { AssetBalanceId } from '@/types';
import { getWalletName } from '@/utils/getWalletName';

import { getLabelName } from '../utils/getLabelName';

import { Label } from './Label';
import { TokenIcon } from './TokenIcon';

import loc from '/loc';

interface CoinHeaderProps {
  assetBalanceId?: AssetBalanceId;
  tag?: JSX.Element;
  text?: string;
}

export const CoinHeader = ({ assetBalanceId, text, tag }: CoinHeaderProps) => {
  const [walletId, _, tokenId] = useResolvedAssetBalance(assetBalanceId);
  const token = useTokenById(tokenId);
  const wallet = useRealmWalletById(walletId);

  if (!wallet) {
    return null;
  }
  const { network } = getImplForWallet(wallet);
  const networkName = getWalletName(wallet.type);
  const titleName = getLabelName(token, wallet);

  return (
    <View style={styles.container}>
      {!!token && <TokenIcon size={32} wallet={wallet} tokenId={token.assetId} tokenSymbol={token.metadata.symbol} />}
      <View style={styles.titleContainer}>
        <View style={styles.titleHeaderContainer}>
          {(text || titleName) && (
            <Label>
              {text
                ? loc.formatString(text, {
                    name: titleName,
                    ticker: token ? token.metadata.symbol : network.nativeTokenSymbol,
                  })
                : titleName}
            </Label>
          )}
          {tag}
        </View>
        {!text && !!token && (
          <Label type="regularCaption1" color="light50">
            {networkName} network
          </Label>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleContainer: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  titleHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
