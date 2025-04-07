import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { OverlappingCollection } from '@/components/OverlappingCollection';
import { TokenIcon } from '@/components/TokenIcon';
import { type WalletType } from '@/onChain/wallets/registry';
import { useTheme } from '@/theme/themes';

interface CoinHeaderSimpleProps {
  coins: { tokenId: string; tokenSymbol: string; tokenNetwork: WalletType }[];
  itemsToShow?: number;
  title: string;
  subtitle: string;
}

export const CoinHeaderSimple = ({ coins, itemsToShow = 2, subtitle, title }: CoinHeaderSimpleProps) => {
  const { colors } = useTheme();
  const omitNetworkIcon = coins.length > 1;
  const items = coins.map(({ tokenId, tokenSymbol, tokenNetwork }) => (
    <TokenIcon size={32} tokenId={tokenId} tokenSymbol={tokenSymbol} networkName={tokenNetwork} forceOmitNetworkIcon={omitNetworkIcon} />
  ));

  return (
    <View style={styles.container}>
      {items.length === 1 ? (
        items
      ) : (
        <OverlappingCollection
          itemSize={32}
          items={items}
          itemsToShow={itemsToShow}
          maskedItemOffset={15}
          hasMoreCountProps={{ backgroundColor: colors.purple_40, fontSize: 12 }}
        />
      )}
      <View style={styles.titleContainer}>
        <View style={styles.titleHeaderContainer}>
          <Label numberOfLines={1}>{title}</Label>
        </View>
        <Label type="regularCaption1" color="light50" numberOfLines={1} style={styles.subtitle}>
          {subtitle}
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
  subtitle: {
    textTransform: 'capitalize',
  },
});
