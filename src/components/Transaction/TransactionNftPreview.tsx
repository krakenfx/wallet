import React from 'react';
import { StyleSheet } from 'react-native';

import { NftMetadata } from '@/realm/nftMetadata';

import { NftBlock } from '../NftBlock';

type Props = {
  nft: { metadata: NftMetadata };
};

export const TransactionNftPreview = ({ nft }: Props) => <NftBlock allowNavigationToNft nft={nft} containerStyle={styles.container} omitSecondaryLabel />;

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
});
