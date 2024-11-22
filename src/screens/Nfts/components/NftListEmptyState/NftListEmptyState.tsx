import { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import type { UINetworkFilter } from '@/components/NetworkFilter/types';
import { NETWORK_FILTER } from '@/components/NetworkFilter/types';

import imageSource from './images/noNftPlaceholder.png';

import loc from '/loc';

type NftListEmptyStateProps = {
  networkFilter: UINetworkFilter[];
  nftList: 'everything' | 'collections';
};

const TEXT_CONTENT = {
  everything: {
    allNetworks: {
      heading: loc.nftList.everythingEmptyState.allNetworks.heading,
      subheading: loc.nftList.everythingEmptyState.allNetworks.subheading,
    },
    selectedNetworks: {
      heading: loc.nftList.everythingEmptyState.selectedNetworks.heading,
      subheading: loc.nftList.everythingEmptyState.selectedNetworks.subheading,
    },
  },
  collections: {
    allNetworks: {
      heading: loc.nftList.collectionsEmptyState.allNetworks.heading,
      subheading: loc.nftList.collectionsEmptyState.allNetworks.subheading,
    },
    selectedNetworks: {
      heading: loc.nftList.collectionsEmptyState.selectedNetworks.heading,
      subheading: loc.nftList.collectionsEmptyState.selectedNetworks.subheading,
    },
  },
};

export const NftListEmptyState = ({ nftList, networkFilter }: NftListEmptyStateProps) => {
  const { heading, subheading } = useMemo(() => {
    if (networkFilter.length === 1 && networkFilter.includes(NETWORK_FILTER.blast)) {
      return {
        heading: loc.nftList.everythingEmptyState.selectedNetworks.blastHeading,
        subheading: loc.nftList.everythingEmptyState.selectedNetworks.blastSubheading,
      };
    }
    return TEXT_CONTENT[nftList][networkFilter.length === 0 ? 'allNetworks' : 'selectedNetworks'];
  }, [nftList, networkFilter]);

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} />
      <Label style={styles.heading} type="boldTitle1" color="light100">
        {heading}
      </Label>
      <Label style={styles.subheading} type="regularBody" color="light75">
        {subheading}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  image: {
    width: 205,
    marginBottom: 8,
  },
  heading: {
    marginBottom: 4,
    textAlign: 'center',
  },
  subheading: {
    textAlign: 'center',
  },
});
