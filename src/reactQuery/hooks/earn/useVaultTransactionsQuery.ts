import { useQuery } from '@tanstack/react-query';

import { fetchVaultTransactions } from '@/api/earn/fetchVaultTransactions';
import type { VaultTransactions } from '@/api/types';
import { useWalletByType } from '@/realm/wallets/useWalletByType';
import { useReceiveAddress } from '@/screens/Receive/hooks/useReceiveAddress';
import { useIsOnline } from '@/utils/useConnectionManager';

const TEN_MINUTES = 600000;

type Params<T> = {
  select?: (data: VaultTransactions) => T;
  vaultAddress: string;
  vaultNetwork: string;
};

export const useVaultTransactionsQuery = <T = VaultTransactions>({ select, vaultAddress, vaultNetwork }: Params<T>) => {
  const isOnline = useIsOnline();
  const ethWallet = useWalletByType('ethereum');
  const ethAddress = useReceiveAddress(ethWallet, isOnline);
  const queryKey = 'defi-vault-transactions';

  return useQuery({
    queryKey: [queryKey, ethAddress, vaultAddress, vaultNetwork],
    staleTime: TEN_MINUTES,
    gcTime: Infinity,
    queryFn: () => (ethAddress ? fetchVaultTransactions(ethAddress, vaultAddress, vaultNetwork) : []),
    select,
  });
};

function selectVaultTransactions(page: number, pageSize: number): (vaultEvents: VaultTransactions) => VaultTransactions {
  return (vaultEvents: VaultTransactions) => vaultEvents.slice(0, page * pageSize);
}

type VaultTransactionsPagedParams = {
  page: number;
  pageSize: number;
  vaultAddress: string;
  vaultNetwork: string;
};

export const useVaultTransactionsPagedQuery = ({ page, pageSize, vaultAddress, vaultNetwork }: VaultTransactionsPagedParams) =>
  useVaultTransactionsQuery({ select: selectVaultTransactions(page, pageSize), vaultAddress, vaultNetwork });
