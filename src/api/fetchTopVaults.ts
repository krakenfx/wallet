import type { TopVault } from '@/utils/adaptTopVaultToCardData';

import { VAULTS_API_KEY } from '/config';

export type TopVaultsResponse = { bestVaults: TopVault[] };

export async function fetchTopVaults(address: string): Promise<TopVaultsResponse> {
  try {
    const route = `https://api.vaults.fyi/v1/top-vault/${address}`;
    const response: TopVaultsResponse = await (await fetch(route, { headers: { 'x-api-key': VAULTS_API_KEY, accept: 'application/json' } })).json();

    return response;
  } catch (e) {
    console.error(e);

    return { bestVaults: [] };
  }
}
