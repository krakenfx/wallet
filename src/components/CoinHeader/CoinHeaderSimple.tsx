import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { TokenIcon } from '@/components/TokenIcon';
import { type WalletType } from '@/onChain/wallets/registry';

interface CoinHeaderSimpleProps {
  tokenAddress: string;
  tokenName: string;
  tokenNetwork: WalletType;
  tokenSymbol: string;
}

export const CoinHeaderSimple = ({ tokenAddress, tokenName, tokenNetwork, tokenSymbol }: CoinHeaderSimpleProps) => {
  return (
    <View style={styles.container}>
      <TokenIcon size={32} tokenId={tokenAddress} tokenSymbol={tokenSymbol} networkName={tokenNetwork} />
      <View style={styles.titleContainer}>
        <View style={styles.titleHeaderContainer}>
          <Label numberOfLines={1}>{tokenName}</Label>
        </View>
        <Label type="regularCaption1" color="light50" style={styles.tokenNetwork}>
          {tokenNetwork}
        </Label>
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
    maxWidth: 175,
  },
  tokenNetwork: {
    textTransform: 'capitalize',
  },
});
