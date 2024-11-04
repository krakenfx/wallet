import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { fetchEnsOwnership } from '@/api/fetchEnsOwnership';
import { Label } from '@/components/Label';
import type { RealmNft } from '@/realm/nfts';

import { NFTLinksItem } from './NFTLinksItem';

import { createErrorHandlerWithContext } from '/helpers/errorHandler';
import loc from '/loc';

type Props = {
  nft: RealmNft;
};

type RoleData = {
  name?: string;
  address?: string;
  avatar?: string;
};

export const ENSOwnership: React.FC<Props> = ({ nft }) => {
  const [data, setData] = useState<{ owner: RoleData; manager: RoleData }>();

  useEffect(() => {
    const fetchData = async () => {
      const ensData = await fetchEnsOwnership(nft.metadata.name);
      if (ensData) {
        setData(ensData);
      }
    };
    fetchData().catch(createErrorHandlerWithContext('ERROR_CONTEXT_PLACEHOLDER'));
  }, [nft.metadata.name]);

  return data ? (
    <Animated.View entering={FadeIn}>
      <Label style={styles.sectionHeading}>{loc.nftView.ens.ownership.label}</Label>
      <NFTLinksItem
        label={loc.nftView.ens.ownership.owner}
        content={data.owner.name || data.owner.address}
        contentImageUrl={data.owner.avatar}
        isFirst
        variant="light"
      />
      <NFTLinksItem
        label={loc.nftView.ens.ownership.manager}
        content={data.manager.name || data.manager.address}
        contentImageUrl={data.owner.avatar}
        isLast
        variant="light"
      />
    </Animated.View>
  ) : null;
};

const styles = StyleSheet.create({
  sectionHeading: {
    marginTop: 32,
    marginBottom: 16,
  },
});
