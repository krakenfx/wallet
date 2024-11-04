import React from 'react';
import { StyleSheet } from 'react-native';

import { NftBlock } from '@/components/NftBlock';
import { useCurrentAccountNumber } from '@/realm/accounts';
import type { NftMetadata } from '@/realm/nftMetadata';
import { useNftById } from '@/realm/nfts';

type Props = {
  nft: { metadata: NftMetadata };
};

export const TransactionNftPreview = ({ nft }: Props) => {
  const realmNft = useNftById(nft.metadata?.assetId);
  const currentAccount = useCurrentAccountNumber();

  return <NftBlock allowNavigationToNft nft={realmNft} currentAccount={currentAccount} containerStyle={styles.container} omitSecondaryLabel />;
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
});
