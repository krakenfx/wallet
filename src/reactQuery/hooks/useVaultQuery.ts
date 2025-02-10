import { useQuery } from '@tanstack/react-query';

const SIX_HOURS = 6 * 3600000;

export const useVaultQuery = (vaultAddress: string, vaultNetwork: string) => {
  const queryKey = 'defi-vault';

  return useQuery({
    queryKey: [queryKey, vaultAddress, vaultNetwork],
    staleTime: SIX_HOURS,
    gcTime: Infinity,
    queryFn: () => fetchVault(vaultAddress, vaultNetwork),
  });
};

interface Reward {
  apy: {
    '1day': number;
    '7day': number;
    '30day': number;
  };
  assetPriceInUsd: number;
  asset: {
    name: string;
    assetAddress: string;
    symbol: string;
    decimals: number;
  };
}

interface Holder {
  address: string;
  balance: string;
}

export interface VaultResult {
  name: string;
  address: string;
  network: string;
  protocol: string;
  tvlDetails: {
    tvlNative: string;
    tvlUsd: string;
    lockedNative: string;
    lockedUsd: string;
    liquidNative: string;
    liquidUsd: string;
  };
  numberOfHolders: number;
  lendLink: string;
  tags: [string];
  token: {
    name: string;
    assetAddress: string;
    symbol: string;
    decimals: number;
  };
  apy: {
    base: {
      '1day': number;
      '7day': number;
      '30day': number;
    };
    rewards: {
      '1day': number;
      '7day': number;
      '30day': number;
    };
    total: {
      '1day': number;
      '7day': number;
      '30day': number;
    };
  };
  description: string;
  rewards: Reward[];
  isTransactional: boolean;
  assetPriceInUsd: number;
  topHolders: Holder[];
  holdersTotalBalance: string;
}

function fetchVault(vaultAddress: string, vaultNetwork: string): VaultResult {
  vaultAddress;
  vaultNetwork;

  return {
    name: 'Alterscope Bedrock EURC',
    address: '0x1987c2DCf5674Cf90bEceBAd502714c357ce126a',
    network: 'mainnet',
    protocol: 'euler',
    tvlDetails: {
      tvlNative: '573412313207',
      tvlUsd: '594999',
      lockedNative: '378951099711',
      lockedUsd: '393218',
      liquidNative: '194461213496',
      liquidUsd: '201781',
    },
    numberOfHolders: 11,
    lendLink: 'https://google.com',
    tags: ['lending'],
    token: {
      name: 'Euro Coin',
      assetAddress: '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c',
      symbol: 'EURC',
      decimals: 6,
    },
    apy: {
      base: {
        '1day': 190,
        '7day': 228,
        '30day': 370,
      },
      rewards: {
        '1day': 3030,
        '7day': 2524,
        '30day': 4800,
      },
      total: {
        '1day': 3220,
        '7day': 2752,
        '30day': 5170,
      },
    },
    description: 'The foundational vaults, designed for maximium market stability.',
    rewards: [
      {
        apy: {
          '1day': 937,
          '7day': 1055,
          '30day': 1706,
        },
        assetPriceInUsd: 33503507,
        asset: {
          name: 'Pyth Network',
          assetAddress: '0xeFc0CED4B3D536103e76a1c4c74F0385C8F4Bdd3',
          symbol: 'PYTH',
          decimals: 6,
        },
      },
      {
        apy: {
          '1day': 2093,
          '7day': 1469,
          '30day': 3094,
        },
        assetPriceInUsd: 440403092,
        asset: {
          name: 'Reward EUL',
          assetAddress: '0x5241e34A1eA2BF6F297bAf158e668e23244464a7',
          symbol: 'rEUL',
          decimals: 18,
        },
      },
    ],
    isTransactional: false,
    assetPriceInUsd: 103764608,
    topHolders: [
      {
        address: '0x1a162a5fdaebb0113f7b83ed87a43bcf0b6a4d1e',
        balance: '234073382619',
      },
      {
        address: '0x233f1d0c0abb1eca410b6e1e7d2560cfd32b07b3',
        balance: '161162244122',
      },
      {
        address: '0x6954ba40d5787041d7d1dbc091e0197c6566e910',
        balance: '48498205091',
      },
      {
        address: '0x75528bf6ed683b0ea4823a26d60c4711d6e2f3ec',
        balance: '42326068160',
      },
      {
        address: '0xb9199558d1144d06a3bd62008de728d858d88108',
        balance: '36685072999',
      },
      {
        address: '0x34ebdd0a91e1752c5f0effc0d19665ee35af093d',
        balance: '24273367604',
      },
      {
        address: '0xf173e9d342de933be804c165aa068fa910b9f647',
        balance: '18962015382',
      },
      {
        address: '0xea69ca2ca84d22e3f53bfd3c6d4e9be18da6402e',
        balance: '4248969066',
      },
      {
        address: '0x9f4c60cf16a75db3bb9b3ae9f63035eabf7285ce',
        balance: '1037328413',
      },
      {
        address: '0x981690ec51bb332ec6eed511c27df325104cb460',
        balance: '579090729',
      },
    ],
    holdersTotalBalance: '571908655480',
  };
}
