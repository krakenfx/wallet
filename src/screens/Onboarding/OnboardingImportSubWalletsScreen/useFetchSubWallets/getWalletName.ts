import { resolveAddressToEnsName } from '@/api/fetchEnsName';

import loc from '/loc';

export function getWalletName(accountIndex: number) {
  return `${loc.onboardingImportSubWallets.importSubWallets.wallet} ${(accountIndex + 1).toString().padStart(2, '0')}`;
}

export async function getWalletNameOrEnsNameIfPresent(accountIndex: number, ethCaip10Account?: string) {
  if (ethCaip10Account) {
    const lastColonIndex = ethCaip10Account.lastIndexOf(':');

    if (lastColonIndex) {
      const ensName = await resolveAddressToEnsName(ethCaip10Account.slice(lastColonIndex + 1));

      if (ensName) {
        return ensName;
      }
    }
  }

  return getWalletName(accountIndex);
}
