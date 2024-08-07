import React from 'react';
import { Linking } from 'react-native';

import { NonSmallIconName } from '@/components/SvgIcon';
import { WalletType } from '@/onChain/wallets/registry';
import { RealmNft } from '@/realm/nfts';

import { NFTLinksItem } from './NFTLinksItem';

type NFTLinksProps = {
  nft: RealmNft;
  walletType: WalletType;
};

const openENSDomains = (name: string) => {
  return () => Linking.openURL(`https://app.ens.domains/${name}`);
};

const openEtherscan = (collectionId: string, tokenId: string) => {
  return () => Linking.openURL(`https://etherscan.io/nft/${collectionId}/${tokenId}`);
};
const openPolygonscan = (collectionId: string, tokenId: string) => {
  return () => Linking.openURL(`https://polygonscan.com/nft/${collectionId}/${tokenId}`);
};
const openBase = (collectionId: string, tokenId: string) => {
  return () => Linking.openURL(`https://basescan.org/token/${collectionId}?a=${tokenId}/`);
};
const openArbiscan = (collectionId: string, tokenId: string) => {
  return () => Linking.openURL(`https://arbiscan.io/token/${collectionId}?a=${tokenId}/`);
};
const openOptimismExplorer = (collectionId: string, tokenId: string) => {
  return () => Linking.openURL(`https://optimistic.etherscan.io/token/${collectionId}?a=${tokenId}`);
};
const openBlastExplorer = (collectionId: string, tokenId: string) => {
  return () => Linking.openURL(`https://blastscan.io/token/${collectionId}?a=${tokenId}`);
};
const openSolscan = (_: string, tokenId: string) => {
  return () => Linking.openURL(`https://solscan.io/token/${tokenId}`);
};

const openOpenseaEthereum = (collectionId: string, tokenId: string) => {
  return () => Linking.openURL(`https://opensea.io/assets/ethereum/${collectionId}/${tokenId}`);
};
const openOpenseaArbitrum = (collectionId: string, tokenId: string) => {
  return () => Linking.openURL(`https://opensea.io/assets/arbitrum/${collectionId}/${tokenId}`);
};
const openOpenseaOptimism = (collectionId: string, tokenId: string) => {
  return () => Linking.openURL(`https://opensea.io/assets/optimism/${collectionId}/${tokenId}`);
};
const openOpenseaPolygon = (collectionId: string, tokenId: string) => {
  return () => Linking.openURL(`https://opensea.io/assets/matic/${collectionId}/${tokenId}`);
};
const openOpenseaBase = (collectionId: string, tokenId: string) => {
  return () => Linking.openURL(`https://opensea.io/assets/base/${collectionId}/${tokenId}`);
};

const openMagicEden = (_: string, tokenId: string) => {
  return () => Linking.openURL(`https://magiceden.io/item-details/${tokenId}`);
};

const openTensorSolana = (_: string, tokenId: string) => {
  return () => Linking.openURL(`https://www.tensor.trade/item/${tokenId}`);
};

type NFTLinkItemConfig = { label: string; onPress: Function; icon?: NonSmallIconName };
export const configNftLinks: Record<
  WalletType,
  | {
      blockchainExplorer: NFTLinkItemConfig;
      marketplaces: NFTLinkItemConfig[];
    }
  | undefined
> = {
  ethereum: {
    blockchainExplorer: {
      label: 'Etherscan',
      onPress: openEtherscan,
      icon: 'etherscan',
    },
    marketplaces: [{ label: 'Opensea', onPress: openOpenseaEthereum, icon: 'opensea' }],
  },
  ethereumTestnetSepolia: {
    blockchainExplorer: {
      label: 'Etherscan',
      onPress: openEtherscan,
      icon: 'etherscan',
    },
    marketplaces: [{ label: 'Opensea', onPress: openOpenseaEthereum, icon: 'opensea' }],
  },
  base: {
    blockchainExplorer: {
      label: 'Base',
      onPress: openBase,
      icon: 'etherscan',
    },
    marketplaces: [{ label: 'Opensea', onPress: openOpenseaBase, icon: 'opensea' }],
  },
  arbitrum: {
    blockchainExplorer: {
      label: 'Arbiscan',
      onPress: openArbiscan,
      icon: 'arbiscan',
    },
    marketplaces: [{ label: 'Opensea', onPress: openOpenseaArbitrum, icon: 'opensea' }],
  },
  optimism: {
    blockchainExplorer: {
      label: 'OP Mainnet Explorer',
      onPress: openOptimismExplorer,
      icon: 'optimistic-etherscan',
    },
    marketplaces: [{ label: 'Opensea', onPress: openOpenseaOptimism, icon: 'opensea' }],
  },
  blast: {
    blockchainExplorer: {
      label: 'Blastscan',
      onPress: openBlastExplorer,
      icon: 'blastscan',
    },
    marketplaces: [{ label: 'Opensea', onPress: openOpenseaOptimism, icon: 'opensea' }],
  },
  polygon: {
    blockchainExplorer: {
      label: 'Polygonscan',
      onPress: openPolygonscan,
      icon: 'polygonscan',
    },
    marketplaces: [{ label: 'Opensea', onPress: openOpenseaPolygon, icon: 'opensea' }],
  },
  solana: {
    blockchainExplorer: {
      label: 'Solscan',
      onPress: openSolscan,
      icon: 'solscan',
    },
    marketplaces: [
      { label: 'Magic Eden', onPress: openMagicEden, icon: 'magic-eden' },
      { label: 'Tensor', onPress: openTensorSolana, icon: 'tensor-trade' },
    ],
  },
  solanaDevnet: {
    blockchainExplorer: {
      label: 'Solscan',
      onPress: openSolscan,
      icon: 'solscan',
    },
    marketplaces: [
      { label: 'Magic Eden', onPress: openMagicEden, icon: 'magic-eden' },
      { label: 'Tensor', onPress: openTensorSolana, icon: 'tensor-trade' },
    ],
  },
  HDsegwitBech32: undefined,
  dogecoin: undefined,
};

export const NFTLinks: React.FC<NFTLinksProps> = ({ nft: { metadata }, walletType }) => {
  const nftLinksItems = configNftLinks[walletType];

  return nftLinksItems ? (
    <>
      {}
      <NFTLinksItem
        isFirst
        label={nftLinksItems.blockchainExplorer.label}
        onPress={nftLinksItems.blockchainExplorer.onPress(metadata.collectionId, metadata.tokenId)}
        variant="light"
        iconRight="chevron-right"
        iconLeft={nftLinksItems.blockchainExplorer.icon}
      />

      {}
      {nftLinksItems.marketplaces.map(({ label, onPress, icon }, i) => {
        return (
          <NFTLinksItem
            label={label}
            onPress={onPress(metadata.collectionId, metadata.tokenId)}
            isLast={nftLinksItems.marketplaces.length - 1 === i}
            variant="light"
            iconRight="chevron-right"
            iconLeft={icon}
            key={i + '_' + metadata.collectionId + '_' + metadata.tokenId}
          />
        );
      })}
    </>
  ) : null;
};

type ENSLinksProps = {
  nft: RealmNft;
};

export const ENSLinks: React.FC<ENSLinksProps> = ({ nft: { metadata } }) => {
  return (
    <>
      <NFTLinksItem label="app.ens.domains" onPress={openENSDomains(metadata.name)} isFirst variant="light" iconRight="chevron-right" iconLeft="ens" />
      <NFTLinksItem
        label="Etherscan"
        onPress={openEtherscan(metadata.collectionId, metadata.tokenId)}
        variant="light"
        iconRight="chevron-right"
        iconLeft="etherscan"
      />
      <NFTLinksItem
        label="Opensea"
        onPress={openOpenseaEthereum(metadata.collectionId, metadata.tokenId)}
        isLast
        variant="light"
        iconRight="chevron-right"
        iconLeft="opensea"
      />
    </>
  );
};
