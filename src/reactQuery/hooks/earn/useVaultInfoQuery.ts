import { useQuery } from '@tanstack/react-query';

import { fetchVaultInfo } from '@/api/earn/fetchVaultInfo';

import { ONE_HOUR } from './consts';

export const useVaultInfoQuery = (vaultAddress: string, vaultNetwork: string) => {
  const queryKey = 'defi-vault-info';
  const vaultNetwork_ = vaultNetwork === 'ethereum' ? 'mainnet' : vaultNetwork;

  return useQuery({
    queryKey: [queryKey, vaultAddress, vaultNetwork_],
    staleTime: ONE_HOUR,
    gcTime: Infinity,
    queryFn: () => fetchVaultInfo(vaultNetwork_, vaultAddress),
  });
};
