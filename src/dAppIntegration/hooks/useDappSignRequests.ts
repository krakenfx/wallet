import { useNavigation } from '@react-navigation/native';

import { useCallback } from 'react';

import type { EVMFeeOption } from '@/api/types';
import { getImplForWallet } from '@/onChain/wallets/registry';
import type { WalletStorage } from '@/onChain/wallets/walletState';
import { getWalletStorage } from '@/onChain/wallets/walletState';
import { useRealm } from '@/realm/RealmContext';
import { useAppCurrency } from '@/realm/settings';
import type { RealmWallet } from '@/realm/wallets';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';

import { openSignMessageApproveModal } from '../openSignMessageApproveModal';
import { openSignTransactionModal } from '../openSignTransactionApprovalModal';
import { RpcMethods } from '../types';
import { type PageInfo } from '../types';

import { isEVMHarmonyTransport, isEVMNetwork } from '/modules/wallet-connect/utils';
import { type TransactionObject, ethSignFnMap } from '/modules/wallet-connect/web3Wallet/ethereum';

const getSignMsg = (method: RpcMethods, params: [string, string]) => {
  if (method === RpcMethods.personal_sign) {
    return params[0];
  }
  return params[1];
};

export const useDappSignRequests = (wallet: RealmWallet, pageInfo: PageInfo) => {
  const { getSeed } = useSecuredKeychain();
  const realm = useRealm();
  const { dispatch } = useNavigation();
  const { currency } = useAppCurrency();

  const signMessage = useCallback(
    async (method: RpcMethods, requestParams: unknown[]) => {
      const { network, transport } = getImplForWallet(wallet);

      if (!isEVMHarmonyTransport(transport) || !isEVMNetwork(network)) {
        
        return false;
      }

      const approved = await openSignMessageApproveModal({ method, requestParams, wallet, dispatch, pageInfo });
      if (approved) {
        const seed = await getSeed('sign');
        if (!seed) {
          
          throw Error('No seed');
        }
        const msg = getSignMsg(method, requestParams as [string, string]);

        return await network[ethSignFnMap[method]](
          {
            ...wallet,
            seed: {
              data: seed,
            },
          },
          msg,
        );
      }
    },
    [dispatch, getSeed, pageInfo, wallet],
  );

  const signTransaction = useCallback(
    async (method: RpcMethods, requestParams: unknown[]) => {
      const { network, transport } = getImplForWallet(wallet);
      if (!isEVMHarmonyTransport(transport) || !isEVMNetwork(network)) {
        return false;
      }
      const transaction = requestParams[0] as TransactionObject;
      const approveObject = await openSignTransactionModal({ method, network, transaction, wallet, dispatch, transport, pageInfo, realm, currency });

      if (approveObject?.approveSignRequest) {
        const seed = await getSeed('sign');

        if (!seed) {
          
          throw Error('No seed');
        }

        const fee = approveObject.fee as EVMFeeOption;
        try {
          const finalPreparedTransaction = await transport.prepareTransaction(
            network,
            wallet,
            (await getWalletStorage(realm, wallet, true)) as WalletStorage<unknown>,
            { ...transaction },
            fee,
            true,
          );
          const result = await network.signTransaction(
            {
              ...wallet,
              seed: {
                data: seed,
              },
            },
            finalPreparedTransaction.data,
          );
          return await transport.broadcastTransaction(network, result);
        } catch (error) {
          
          console.log(error);
        }
      }
    },
    [currency, dispatch, getSeed, pageInfo, realm, wallet],
  );

  return {
    signTransaction,
    signMessage,
  };
};
