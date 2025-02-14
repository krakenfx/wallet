import { useQuery } from '@tanstack/react-query';

const TEN_MINUTES = 600000;

type Params<T> = {
  select?: (data: VaultTransaction[]) => T;
  vaultAddress: string;
  vaultNetwork: string;
};

export const useVaultTransactionsQuery = <T = VaultTransaction[]>({ select, vaultAddress, vaultNetwork }: Params<T>) => {
  const queryKey = 'defi-vault-transactions';

  return useQuery({
    queryKey: [queryKey, vaultAddress, vaultNetwork],
    staleTime: TEN_MINUTES,
    gcTime: Infinity,
    queryFn: () => fetchVaultTransactions(vaultAddress, vaultNetwork),
    select,
  });
};

export type VaultTransaction = {
  activity: 'Transfer' | 'Withdrawal' | 'Deposit';
  timestamp: number;
  amount: {
    usd: number;
    native: string;
  };
  positionValue: {
    usd: number;
    native: string;
  };
};

function fetchVaultTransactions(vaultAddress: string, vaultNetwork: string): VaultTransaction[] {
  vaultAddress;
  vaultNetwork;

  return [
    {
      activity: 'Deposit',
      timestamp: Date.now() / 1000,
      amount: {
        usd: 0.24438541999999758,
        native: '99999999999999',
      },
      positionValue: {
        usd: 0.24438541999999758,
        native: '99999999999999',
      },
    },
    {
      activity: 'Deposit',
      timestamp: Date.now() / 1000 - 24 * 60 * 60,
      amount: {
        usd: 0.24438541999999758,
        native: '99999999999999',
      },
      positionValue: {
        usd: 0.24438541999999758,
        native: '99999999999999',
      },
    },
    {
      activity: 'Deposit',
      timestamp: 1728672299,
      amount: {
        usd: 0.24438541999999758,
        native: '99999999999999',
      },
      positionValue: {
        usd: 0.24438541999999758,
        native: '99999999999999',
      },
    },
    {
      activity: 'Transfer',
      timestamp: 1708672299,
      amount: {
        usd: 77,
        native: '99999999999999',
      },
      positionValue: {
        usd: 77,
        native: '99999999999999',
      },
    },
    {
      activity: 'Withdrawal',
      timestamp: 1708672299,
      amount: {
        usd: 88,
        native: '450',
      },
      positionValue: {
        usd: 88,
        native: '450',
      },
    },
    {
      activity: 'Deposit',
      timestamp: 1708672299,
      amount: {
        usd: 100,
        native: '0.23',
      },
      positionValue: {
        usd: 100,
        native: '0.23',
      },
    },
  ];
}

function selectVaultTransactions(page: number, pageSize: number): (vaultEvents: VaultTransaction[]) => VaultTransaction[] {
  return (vaultEvents: VaultTransaction[]) => vaultEvents.slice(0, page * pageSize);
}

type VaultTransactionsPagedParams = {
  page: number;
  pageSize: number;
  vaultAddress: string;
  vaultNetwork: string;
};

export const useVaultTransactionsPagedQuery = ({ page, pageSize, vaultAddress, vaultNetwork }: VaultTransactionsPagedParams) =>
  useVaultTransactionsQuery({ select: selectVaultTransactions(page, pageSize), vaultAddress, vaultNetwork });
