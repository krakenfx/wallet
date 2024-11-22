import { AvascanCChain, EVMNetwork, Etherscan } from './evm';

import loc from '/loc';

export const ethereumNetwork = new EVMNetwork({
  label: loc.network.ethereum,
  chainId: 1,
  nativeTokenSlipId: 60,
  nativeTokenSymbol: 'ETH',
  blockExplorer: new Etherscan('etherscan.io'),
  defaultGasLimit: 21000,
});

export const ethereumSepoliaNetwork = new EVMNetwork({
  chainId: 11155111,
  nativeTokenSlipId: 1,
  nativeTokenSymbol: 'ETH',
  label: loc.network.ethereum_sepolia,
  blockExplorer: new Etherscan('sepolia.etherscan.io'),
  isTestnet: true,
  defaultGasLimit: 21000,
});

export const polygonNetwork = new EVMNetwork({
  chainId: 137,
  nativeTokenSlipId: 966,
  nativeTokenSymbol: 'POL',
  label: loc.network.polygon,
  blockExplorer: new Etherscan('polygonscan.com'),
  icon: ({ opacity }) => ({
    id: 'pol',
    fgColor: ['#6c4dc2', '#99e3ed', -45],
    bgColor: `rgba(132, 92, 224, ${opacity})`,
  }),

  disable1559: true,
  defaultGasLimit: 21000,
});

export const arbitrumNetwork = new EVMNetwork({
  chainId: 42161,
  nativeTokenSlipId: 60,
  nativeTokenSymbol: 'ETH',
  nativeTokenLabel: 'Ethereum',
  label: loc.network.arbitrum,
  blockExplorer: new Etherscan('arbiscan.io'),
  defaultGasLimit: 70000,
  icon: ({ opacity }) => ({
    id: 'arb',
    fgColor: ['#6c4dc2', '#99e3ed', -45],
    bgColor: `rgba(132, 92, 224, ${opacity})`,
  }),
});

export const baseNetwork = new EVMNetwork({
  chainId: 8453,
  nativeTokenSlipId: 60,
  nativeTokenSymbol: 'ETH',
  nativeTokenLabel: 'Ethereum',
  label: loc.network.base,
  blockExplorer: new Etherscan('basescan.org'),
  icon: ({ opacity }) => ({
    id: 'base',
    fgColor: ['#6c4dc2', '#99e3ed', -45],
    bgColor: `rgba(132, 92, 224, ${opacity})`,
  }),
  defaultGasLimit: 21000,
});

export const optimismNetwork = new EVMNetwork({
  chainId: 10,
  nativeTokenSlipId: 60,
  nativeTokenSymbol: 'ETH',
  nativeTokenLabel: 'Ethereum',
  label: loc.network.optimism,
  blockExplorer: new Etherscan('optimistic.etherscan.io'),
  icon: ({ opacity }) => ({
    id: 'op',
    fgColor: ['#6c4dc2', '#99e3ed', -45],
    bgColor: `rgba(132, 92, 224, ${opacity})`,
  }),
  defaultGasLimit: 21000,
});

export const blastNetwork = new EVMNetwork({
  chainId: 81457,
  nativeTokenSlipId: 60,
  nativeTokenSymbol: 'ETH',
  nativeTokenLabel: 'Ethereum',
  label: loc.network.blast,
  blockExplorer: new Etherscan('blastscan.io'),
  icon: ({ opacity }) => ({
    id: 'blast',
    fgColor: ['#6c4dc2', '#99e3ed', -45],
    bgColor: `rgba(132, 92, 224, ${opacity})`,
  }),
  defaultGasLimit: 21000,
});

export const lineaNetwork = new EVMNetwork({
  chainId: 59144,
  nativeTokenSlipId: 60,
  nativeTokenSymbol: 'ETH',
  nativeTokenLabel: 'Ethereum',
  label: loc.network.linea,
  blockExplorer: new Etherscan('lineascan.build'),
  icon: ({ opacity }) => ({
    id: 'linea',
    fgColor: ['#6c4dc2', '#99e3ed', -45],
    bgColor: `rgba(132, 92, 224, ${opacity})`,
  }),
  defaultGasLimit: 21000,
});

export const avalancheCChainNetwork = new EVMNetwork({
  chainId: 43114,
  nativeTokenSlipId: 9005,
  nativeTokenSymbol: 'AVAX',
  nativeTokenLabel: 'Avalanche',
  blockchainLabel: 'C-Chain',
  label: loc.network.avalanche,
  blockExplorer: new AvascanCChain('avascan.info'),
  icon: ({ opacity }) => ({
    id: 'avax',
    fgColor: ['#6c4dc2', '#99e3ed', -45],
    bgColor: `rgba(132, 92, 224, ${opacity})`,
  }),
  defaultGasLimit: 21000,
  gasUnit: 'nAVAX',
});

export const inkSepoliaNetwork = new EVMNetwork({
  chainId: 763373,
  nativeTokenSlipId: 1,
  nativeTokenSymbol: 'ETH',
  nativeTokenLabel: 'Ethereum - Sepolia testnet',
  label: loc.network.ink_sepolia,
  blockExplorer: new Etherscan('explorer-sepolia.inkonchain.com'),
  defaultGasLimit: 21000,
});
