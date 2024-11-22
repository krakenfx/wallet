import type { ImageRequireSource } from 'react-native';

import { uniq } from 'lodash';
import { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import type { Network } from '@/onChain/wallets/base';
import { getNetworkName } from '@/onChain/wallets/registry';

import loc from '/loc';

type Props = {
  hasSearchValue?: boolean;
  supportedNetworks: Network[];
  clearSearch: () => void;
  goBack: () => void;
};

export const EmptyState = ({ hasSearchValue, supportedNetworks, clearSearch, goBack }: Props) => {
  const data: {
    image: ImageRequireSource;
    title: string;
    desc: string;
  } = useMemo(() => {
    const flattenedNetworks = uniq(supportedNetworks.map(getNetworkName));

    switch (true) {
      case hasSearchValue:
        return {
          title: loc.universalSend.searchEmptyTitle,
          desc: loc.universalSend.searchEmptyDesc,
          image: require('@/assets/images/common/search.png'),
        };
      case flattenedNetworks.length !== 1:
        return {
          title: loc.universalSend.assetsEmptyTitle,
          desc: loc.universalSend.assetsEmptyDesc,
          image: require('@/assets/images/assetGroup/asset-group.png'),
        };
      case flattenedNetworks[0] === 'BitcoinNetwork':
        return {
          title: loc.universalSend.assetBTCEmptyTitle,
          desc: loc.universalSend.assetBTCEmptyDesc,
          image: require('@/assets/images/assetGroup/asset-group-bitcoin.png'),
        };
      case flattenedNetworks[0] === 'DogecoinNetwork':
        return {
          title: loc.universalSend.assetDogeEmptyTitle,
          desc: loc.universalSend.assetDogeEmptyDesc,
          image: require('@/assets/images/assetGroup/asset-group-dogecoin.png'),
        };
      case flattenedNetworks[0] === 'SolanaNetwork':
        return {
          title: loc.universalSend.assetSolanaEmptyTitle,
          desc: loc.universalSend.assetSolanaEmptyDesc,
          image: require('@/assets/images/assetGroup/asset-group-solana.png'),
        };
      case flattenedNetworks[0] === 'EVMNetwork':
        return {
          title: loc.universalSend.assetEthereumEmptyTitle,
          desc: loc.universalSend.assetEthereumaEmptyDesc,
          image: require('@/assets/images/assetGroup/asset-group-ethereum.png'),
        };
      default:
        return {
          title: loc.universalSend.assetsEmptyTitle,
          desc: loc.universalSend.assetsEmptyDesc,
          image: require('@/assets/images/assetGroup/asset-group.png'),
        };
    }
  }, [hasSearchValue, supportedNetworks]);

  return (
    <View style={[styles.emptyContainer, hasSearchValue && styles.emptyContainerSearch]}>
      <Image source={data.image} style={[styles.emptyImage, hasSearchValue && styles.emptyImageSmall]} />
      <Label style={styles.emptyTitle} type="boldTitle0">
        {data.title}
      </Label>
      <Label color="light75" type="regularBody" style={styles.emptyDescription}>
        {data.desc}
      </Label>
      {hasSearchValue ? (
        <Button size="small" text={loc.universalSend.clearSearch} onPress={clearSearch} style={styles.button} />
      ) : (
        <Button size="small" text={loc.universalSend.goBack} onPress={goBack} style={styles.button} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainerSearch: {
    marginTop: 12,
  },
  emptyTitle: {
    marginVertical: 8,
  },
  emptyDescription: {
    textAlign: 'center',
    marginHorizontal: 24,
  },
  emptyImage: {
    width: 280,
    height: 280,
  },
  emptyImageSmall: {
    width: 140,
    height: 140,
  },
  button: {
    marginTop: 16,
  },
});
