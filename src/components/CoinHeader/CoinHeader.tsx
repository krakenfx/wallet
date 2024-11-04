import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { TokenIcon } from '@/components/TokenIcon';
import { getImplForWallet } from '@/onChain/wallets/registry';
import type { RealmToken } from '@/realm/tokens';
import type { RealmWallet } from '@/realm/wallets';
import { getLabelName } from '@/utils/getLabelName';
import { getWalletName } from '@/utils/getWalletName';

import loc from '/loc';

interface CoinHeaderProps {
  wallet: RealmWallet | null;
  token?: RealmToken;
  text?: string;
}

export const CoinHeader = ({ wallet, token, text }: CoinHeaderProps) => {
  if (!wallet) {
    return null;
  }
  const { network } = getImplForWallet(wallet);
  const networkName = getWalletName(wallet.type);
  const titleName = getLabelName(token, wallet);

  return (
    <View style={styles.container}>
      {token && <TokenIcon size={32} wallet={wallet} tokenId={token.assetId} tokenSymbol={token.metadata.symbol} />}
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
        </View>
        {!text && Boolean(token) && (
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
