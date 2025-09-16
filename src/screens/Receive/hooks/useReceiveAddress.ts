import { useCallback, useEffect, useState } from 'react';

import { useGetWalletStorage } from '@/hooks/useGetWalletStorage';
import type { Network, Transport } from '@/onChain/wallets/base';
import { getImplForWallet } from '@/onChain/wallets/registry';
import type { RealmWallet } from '@/realm/wallets';
import { runAfterUISync } from '@/utils/runAfterUISync';

import { handleError } from '/helpers/errorHandler';
import { Timeout, timeout } from '/helpers/timeout';
import loc from '/loc';

export const getReceiveAddress = async (
  network: Network,
  transport: Transport<unknown, unknown, unknown>,
  wallet: RealmWallet,
  getWalletStorage: ReturnType<typeof useGetWalletStorage>,
  isOnline?: boolean | null,
) => {
  if (!wallet || !network || !getWalletStorage) {
    return;
  }
  if (network.getReceiveAddress) {
    const storage = await getWalletStorage(wallet);

    if (transport.fetchState && isOnline) {
      try {
        await timeout(transport.fetchState?.(wallet, network, storage), 3000);
      } catch (e) {
        if (e instanceof Timeout) {
          // ignore fetch timeout
          return;
        }
        await handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
      }
    }

    return await network.getReceiveAddress(wallet, storage);
  }
  return await network.deriveAddress(wallet);
};

export const useReceiveAddress = (wallet: RealmWallet, isOnline?: boolean | null) => {
  const { network, transport } = getImplForWallet(wallet);
  const getWalletStorage = useGetWalletStorage();
  const [address, setAddress] = useState<string>();

  const fetchAddress = useCallback(
    async () => await getReceiveAddress(network, transport, wallet, getWalletStorage, isOnline),
    [getWalletStorage, isOnline, network, transport, wallet],
  );

  useEffect(() => {
    runAfterUISync(() => {
      fetchAddress()
        .then(result => {
          setAddress(String(result));
        })
        .catch(e => {
          handleError(e, 'ERROR_CONTEXT_PLACEHOLDER', { text: loc.receive.addressError });
        });
    });
  }, [wallet, network, transport, getWalletStorage, address, isOnline, fetchAddress]);

  return address;
};
