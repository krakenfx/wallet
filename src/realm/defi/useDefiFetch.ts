import { useCallback, useRef } from 'react';

import { fetchDefiPositions } from '@/api/fetchDefiPositions';
import { useGetWalletStorage } from '@/hooks/useGetWalletStorage';
import { DefiNetworks, getImplForWallet } from '@/onChain/wallets/registry';
import { useRealm } from '@/realm/RealmContext';
import type { RealmWallet } from '@/realm/wallets';
import { getWalletsForMutations } from '@/realm/wallets';

import { useUsdFiatRatesMutations } from '../usdFiatRates';

import { useDefiMutations } from './useDefiMutations';

import { handleError } from '/helpers/errorHandler';

export const useDefiFetch = () => {
  const realm = useRealm();
  const { saveDefis } = useDefiMutations();
  const { saveFiatRates } = useUsdFiatRatesMutations();
  const getWalletStorage = useGetWalletStorage();
  const isFetchingAll = useRef<boolean>(false);

  const fetchAndUpdateDefi = useCallback(async () => {
    if (isFetchingAll.current) {
      return;
    }
    isFetchingAll.current = true;
    const wallets = getWalletsForMutations(realm);
    const addressList: { wallet: RealmWallet; address: string }[] = [];

    for (const wallet of wallets) {
      const { network } = getImplForWallet(wallet);
      if (!DefiNetworks.find(n => network.caipId === n.caipId)) {
        
        continue;
      }
      let address: string;
      if (network.getReceiveAddress) {
        address = await network.getReceiveAddress(wallet, await getWalletStorage(wallet));
      } else {
        address = await network.deriveAddress!(wallet);
      }
      if (!addressList.find(add => add.address === address)) {
        
        addressList.push({ wallet, address });
      }
    }

    for (const [index, { address, wallet }] of addressList.entries()) {
      try {
        const { positions, fiatRates } = await fetchDefiPositions(address);
        if (index === 0) {
          
          saveFiatRates(fiatRates);
        }
        saveDefis(positions, wallet);
      } catch (e) {
        handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
      }
    }
    isFetchingAll.current = false;
  }, [getWalletStorage, realm, saveDefis, saveFiatRates]);

  return {
    fetchAndUpdateDefi,
  };
};
