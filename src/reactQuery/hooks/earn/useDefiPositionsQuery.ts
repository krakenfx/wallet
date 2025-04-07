import { useQuery } from '@tanstack/react-query';
import { pipe } from 'lodash/fp';

import { fetchDefiPositions } from '@/api/earn/fetchDefiPositions';
import { type ProtocolWithPositions } from '@/api/types';
import type { DefiProtocol, Position } from '@/components/DefiProtocolPositions/DefiProtocolPositions.types';
import { useWalletByType } from '@/realm/wallets/useWalletByType';
import { useReceiveAddress } from '@/screens/Receive/hooks/useReceiveAddress';
import { useIsOnline } from '@/utils/useConnectionManager';

import { mapDefiProtocols } from './utils';

const TEN_MINUTES = 10 * 60000;

const useProtocolWithPositionsQuery = <T = DefiProtocol[]>(select: (pwp: ProtocolWithPositions[]) => T) => {
  const isOnline = useIsOnline();
  const ethWallet = useWalletByType('ethereum');
  const ethAddress = useReceiveAddress(ethWallet, isOnline);
  const queryKey = 'defi-positions';

  return useQuery({
    enabled: !!ethAddress,
    queryKey: [queryKey, ethAddress],
    staleTime: TEN_MINUTES,
    gcTime: Infinity,
    select,

    queryFn: () => fetchDefiPositions(ethAddress!),
  });
};

export const useDefiPositionsQuery = () => {
  return useProtocolWithPositionsQuery(mapDefiProtocols);
};

export const useDefiPositionQuery = (vaultAddress: string) => {
  return useProtocolWithPositionsQuery(pipe(mapDefiProtocols, selectPosition(vaultAddress)));
};

function selectPosition(vaultAddress: string) {
  return function select(dps: DefiProtocol[]): Position | undefined {
    let result;

    for (const dp of dps) {
      const position = dp.positions.find(p => p.vaultAddress === vaultAddress);

      if (position) {
        result = position;
        break;
      }
    }

    return result;
  };
}
