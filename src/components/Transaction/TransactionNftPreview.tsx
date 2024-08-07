import React from 'react';
import { StyleSheet } from 'react-native';

import { NftBlock } from '@/components/NftBlock';
import { NftMetadata } from '@/realm/nftMetadata';

type Props = {
  nft: { metadata: NftMetadata };
};

export const TransactionNftPreview = ({ nft }: Props) => <NftBlock allowNavigationToNft nft={nft} containerStyle={styles.container} omitSecondaryLabel />;

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
});
