import { useQuery } from '@tanstack/react-query';

import { useWalletByType } from '@/realm/wallets/useWalletByType';
import { useReceiveAddress } from '@/screens/Receive/hooks/useReceiveAddress';
import { useIsOnline } from '@/utils/useConnectionManager';

const SIX_HOURS = 6 * 3600000;

export const usePositionsQuery = <T = PositionsResult>(select?: (data: PositionsResult) => T) => {
  const isOnline = useIsOnline();
  const ethWallet = useWalletByType('ethereum');
  const ethAddress = useReceiveAddress(ethWallet, isOnline) || '';
  const queryKey = 'defi-positions';

  return useQuery({
    queryKey: [queryKey, ethAddress],
    staleTime: SIX_HOURS,
    gcTime: Infinity,
    queryFn: () => fetchPositions(ethAddress),
    select,
  });
};

export type PositionsResult = Record<string, VaultBalance[]>;

export interface VaultBalance {
  vaultAddress: string;
  protocolName: string;
  vaultName: string;
  balanceUsd: string;
  balanceNative: string;
  balanceLp: string;
  apy: {
    base: number;
    rewards: number;
    total: number;
  };
  asset: {
    name: string;
    assetAddress: string;
    symbol: string;
    decimals: number;
  };
}

function fetchPositions(address: string): PositionsResult {
  address;

  return {
    base: [
      {
        vaultAddress: '0xb125E6687d4313864e53df431d5425969c15Eb2F',
        protocolName: 'compound',
        vaultName: 'Compound v3 USDC',
        balanceUsd: '0.002595796680104442085927252',
        balanceNative: '2596',
        balanceLp: '2596',
        apy: {
          base: 705,
          rewards: 224,
          total: 929,
        },
        asset: {
          name: 'USD Coin',
          assetAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          symbol: 'USDC',
          decimals: 6,
        },
      },
    ],
    mainnet: [
      {
        vaultAddress: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
        protocolName: 'lido',
        vaultName: 'Lido stETH',
        balanceUsd: '0.322333933577830079570113498',
        balanceNative: '100732634350333',
        balanceLp: '100732634350333',
        apy: {
          base: 294,
          total: 294,
          rewards: 0,
        },
        asset: {
          name: 'Ether',
          assetAddress: '0x0000000000000000000000000000000000000000',
          symbol: 'ETH',
          decimals: 18,
        },
      },
    ],
    arbitrum: [],
    optimism: [],
  };
}
