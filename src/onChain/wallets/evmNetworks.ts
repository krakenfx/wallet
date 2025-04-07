import { AvascanCChain, EVMNetwork, Etherscan } from './evm';

import loc from '/loc';

export const ethereumNetwork = new EVMNetwork({
  label: loc.network.ethereum,
  chainId: 1,
  nativeTokenSlipId: 60,
  nativeTokenSymbol: 'ETH',
  blockExplorer: new Etherscan('etherscan.io'),
  defaultGasLimit: 21000,
  krakenConnectNetworkId: 'd9d375da-44b7-4be1-8a00-8b281acfe366',
  krakenConnectMethodId: 'f1546110-35ff-4225-a67e-cb09b8ec7b52',
  krakenConnectMethodName: 'Ether',
});

export const ethereumSepoliaNetwork = new EVMNetwork({
  chainId: 11155111,
  nativeTokenSlipId: 1,
  nativeTokenSymbol: 'ETH',
  label: loc.network.ethereum_sepolia,
  blockExplorer: new Etherscan('sepolia.etherscan.io'),
  isTestnet: true,
  defaultGasLimit: 21000,
  krakenConnectNetworkId: null,
  krakenConnectMethodId: null,
  krakenConnectMethodName: null,
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
  krakenConnectNetworkId: 'c44d2870-12b3-470d-91d3-be3da709fe16',
  krakenConnectMethodId: '739460ff-9ef5-4152-bf51-7a7d35f3c2b7',
  krakenConnectMethodName: 'Ethereum (Polygon)',
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
  krakenConnectNetworkId: 'bc7562cf-1e51-4308-b52b-d062aaa6aa3b',
  krakenConnectMethodId: '95f38698-44ef-41fc-9c2e-049f8a1bcb44',
  krakenConnectMethodName: 'Arbitrum One',
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
  krakenConnectNetworkId: '9637bc15-ec8a-43de-8310-887f0a02a9ed',
  krakenConnectMethodId: '8debb585-0daa-4a8f-8928-5e13c2bc7c21',
  krakenConnectMethodName: 'Base',
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
  krakenConnectNetworkId: 'ed5138ed-ef50-4553-ae20-bb3a00b7c12e',
  krakenConnectMethodId: 'a54acf67-5f8e-456a-bfa4-e2b846956ae2',
  krakenConnectMethodName: 'Optimism',
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
  krakenConnectNetworkId: null,
  krakenConnectMethodId: null,
  krakenConnectMethodName: null,
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
  krakenConnectNetworkId: '53e19d26-31f1-4103-ad77-5ec8a39f7422',
  krakenConnectMethodId: 'ce87d87a-c6a2-4b4a-8363-45be6960e2e6',
  krakenConnectMethodName: 'Linea',
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
  krakenConnectNetworkId: null,
  krakenConnectMethodId: null,
  krakenConnectMethodName: null,
});

export const inkNetwork = new EVMNetwork({
  chainId: 57073,
  nativeTokenSlipId: 60,
  nativeTokenSymbol: 'ETH',
  nativeTokenLabel: 'Ethereum',
  label: loc.network.ink,
  blockExplorer: new Etherscan('explorer.inkonchain.com'),
  defaultGasLimit: 21000,
  krakenConnectNetworkId: 'f039bd2a-ad6c-4a3d-9c82-04c0167f49c9',
  krakenConnectMethodId: 'cd9a0143-3843-4f07-95c4-3ff3b8ca2d42',
  krakenConnectMethodName: 'Ink',
});

export const inkSepoliaNetwork = new EVMNetwork({
  chainId: 763373,
  nativeTokenSlipId: 1,
  nativeTokenSymbol: 'ETH',
  nativeTokenLabel: 'Ethereum - Ink Sepolia',
  label: loc.network.ink_sepolia,
  blockExplorer: new Etherscan('explorer-sepolia.inkonchain.com'),
  isTestnet: true,
  defaultGasLimit: 21000,
  krakenConnectNetworkId: null,
  krakenConnectMethodId: null,
  krakenConnectMethodName: null,
});
