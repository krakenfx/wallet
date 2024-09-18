import { useCallback } from 'react';

import { PushNotifications } from '@/api/PushNotifications';
import { useGetWalletStorage } from '@/hooks/useGetWalletStorage';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { useRealmWallets } from '@/realm/wallets';


export const useGetSubscribeNotifications = () => {
  const wallets = useRealmWallets(true);
  const getWalletStorage = useGetWalletStorage();

  
  const subscribeToNotifications = useCallback(async () => {
    const pushInstance = PushNotifications.getInstance();
    const pushToken = await pushInstance.getDeviceToken();

    
    let addresses2subscribe: string[] = [];
    if (pushToken) {
      for (const wallet2subscribe of wallets) {
        const store = await getWalletStorage(wallet2subscribe, false);
        const { network: network2subscribe } = getImplForWallet(wallet2subscribe);
        const addresses = await network2subscribe.deriveAllAddresses(wallet2subscribe, store, true);
        addresses2subscribe = addresses2subscribe.concat(addresses);
      }

      
      await pushInstance.subscribeAddressesToPushNotifications(addresses2subscribe);
    }
  }, [wallets, getWalletStorage]);

  return {
    subscribeToNotifications,
  };
};
