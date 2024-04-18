import React from 'react';
import { SvgProps } from 'react-native-svg';

import i1 from 'kraken-wallet-network-icons/src/arbitrum.svg';
import i2 from 'kraken-wallet-network-icons/src/aurora.svg';
import i3 from 'kraken-wallet-network-icons/src/avalanche.svg';
import i4 from 'kraken-wallet-network-icons/src/base.svg';
import i5 from 'kraken-wallet-network-icons/src/binance.svg';
import i6 from 'kraken-wallet-network-icons/src/bitcoin.svg';
import i7 from 'kraken-wallet-network-icons/src/celo.svg';
import i8 from 'kraken-wallet-network-icons/src/cronos.svg';
import i9 from 'kraken-wallet-network-icons/src/doge.svg';
import i10 from 'kraken-wallet-network-icons/src/ethereum-goerli.svg';
import i11 from 'kraken-wallet-network-icons/src/ethereum-sepolia.svg';
import i12 from 'kraken-wallet-network-icons/src/ethereum.svg';
import i13 from 'kraken-wallet-network-icons/src/evmos.svg';
import i14 from 'kraken-wallet-network-icons/src/fantom.svg';
import i15 from 'kraken-wallet-network-icons/src/gnosis.svg';
import i16 from 'kraken-wallet-network-icons/src/harmony.svg';
import i17 from 'kraken-wallet-network-icons/src/hydra.svg';
import i18 from 'kraken-wallet-network-icons/src/moonriver.svg';
import i19 from 'kraken-wallet-network-icons/src/optimism.svg';
import i20 from 'kraken-wallet-network-icons/src/polygon.svg';
import i21 from 'kraken-wallet-network-icons/src/solana-devnet.svg';
import i22 from 'kraken-wallet-network-icons/src/solana.svg';
import i23 from 'kraken-wallet-network-icons/src/pokt.svg';

export const networkIcons = {
  arbitrum: i1,
  aurora: i2,
  avalanche: i3,
  base: i4,
  binance: i5,
  bitcoin: i6,
  celo: i7,
  cronos: i8,
  doge: i9,
  'ethereum-goerli': i10,
  'ethereum-sepolia': i11,
  ethereum: i12,
  evmos: i13,
  fantom: i14,
  gnosis: i15,
  harmony: i16,
  hydra: i17,
  moonriver: i18,
  optimism: i19,
  pokt: i23,
  polygon: i20,
  'solana-devnet': i21,
  solana: i22,
};

const mapNetworkNameToNetworkIconName = (networkName: string) => {
  let networkIconName = networkName;

  
  switch (networkName) {
    case 'hdsegwitbech32':
      networkIconName = 'bitcoin';
      break;
    case 'ethereumtestnetsepolia':
      networkIconName = 'ethereum-sepolia';
      break;
    case 'solanadevnet':
      networkIconName = 'solana-devnet';
      break;
    case 'dogecoin':
      networkIconName = 'doge';
      break;
    case 'pocket':
      networkIconName = 'pokt';
      break;
  }

  return networkIconName;
};

export const getNetworkIcon = (networkName: string): React.FC<SvgProps> | undefined =>
  networkIcons[mapNetworkNameToNetworkIconName(networkName.toLowerCase()) as keyof typeof networkIcons];
