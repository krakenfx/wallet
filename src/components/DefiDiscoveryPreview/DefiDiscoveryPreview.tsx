import { Image, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { Card } from '@/components/Card';
import { Label } from '@/components/Label';
import { TokenIcon } from '@/components/TokenIcon';
import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import { useTopVaultsCardDataQuery } from '@/reactQuery/hooks/useTopVaultsCardDataQuery';

import { DefiDiscoveryPreviewSkeleton } from './DefiDiscoveryPreviewSkeleton';

type Props = { caption?: string };

export const DefiDiscoveryPreview = ({ caption }: Props) => {
  const { data: cards, isLoading } = useTopVaultsCardDataQuery();

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        horizontal
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsHorizontalScrollIndicator={false}>
        {isLoading ? (
          <DefiDiscoveryPreviewSkeleton />
        ) : (
          cards?.map(({ assetId, assetSymbol, assetNetwork, protocolIcon, protocolName, protocolApr }) => {
            const onPress = () => {};

            return (
              <Card onPress={onPress}>
                <View style={styles.cardContent}>
                  <TokenIcon
                    tokenId={assetId}
                    tokenSymbol={assetSymbol}
                    networkName={assetNetwork}
                    forceOmitNetworkIcon={assetId === ChainAgnostic.COIN_ETHEREUM && assetNetwork === 'ethereum'}
                  />
                  <View style={styles.labels}>
                    <Label type="boldTitle2" style={styles.assetSymbol}>
                      {assetSymbol}
                    </Label>
                    <Image source={protocolIcon} />
                    <Label type="regularCaption1" color="light50" style={styles.protocolName}>
                      {protocolName}
                    </Label>
                  </View>
                  <View style={styles.apy}>
                    <Label type="boldTitleEarnPercentage" color="green400">
                      {protocolApr}
                    </Label>
                    <Label type="boldCaption1" color="green400">
                      APY
                    </Label>
                  </View>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>
      {caption && (
        <Label type="regularCaption1" color="light50" style={styles.caption}>
          {caption}
        </Label>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 24,
    marginHorizontal: -24,
  },
  contentContainer: {
    alignItems: 'center',
    gap: 8,
    paddingRight: 48,
  },
  cardContent: {
    width: 112,
    gap: 8,
  },
  labels: {
    paddingTop: 4,
  },
  assetSymbol: {
    textTransform: 'uppercase',
  },
  protocolName: {
    textTransform: 'capitalize',
  },
  apy: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  caption: {
    paddingTop: 16,
    paddingHorizontal: 24,
    textAlign: 'center',
  },
});
