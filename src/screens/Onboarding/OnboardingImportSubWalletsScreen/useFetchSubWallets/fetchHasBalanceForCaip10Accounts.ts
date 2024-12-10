import { fetchBalancesV2HasBalance } from '@/api/fetchBalancesV2HasBalance';

export async function fetchHasBalanceForCaip10Accounts(caip10Accounts: Record<string, string[]>) {
  const caip10AccountsFlat = Object.values(caip10Accounts).flat();
  const balances = await fetchBalancesV2HasBalance(caip10AccountsFlat);

  return balances;
}
