import type { EVMHarmonyTransport, EVMNetwork } from '@/onChain/wallets/evm';
import { type WalletStorage, getWalletStorage } from '@/onChain/wallets/walletState';
import { TRANSACTION_TYPES } from '@/realm/transactions/const';
import type { RealmWallet } from '@/realm/wallets';
import type { Currency } from '@/screens/Settings/currency';

import type { EvmRpcMethod } from './constants';
import type { PageInfo } from './types';

import type Realm from 'realm';

import type { ReactNavigationDispatch } from '/modules/wallet-connect';
import { getWarningFromSimulation } from '/modules/wallet-connect/utils';
import { type TransactionObject, adaptTransactionObjectToDefinitionList, classifyTransaction } from '/modules/wallet-connect/web3Wallet/ethereum';
import {
  getSignStructuredParamsFromTransaction,
  navigateToSignStructuredTransactionPage,
} from '/modules/wallet-connect/web3Wallet/navigateToSignStructuredTransactionPage';

interface Options {
  method: EvmRpcMethod;
  network: EVMNetwork;
  transaction: TransactionObject;
  transport: EVMHarmonyTransport;
  wallet: RealmWallet;
  dispatch: ReactNavigationDispatch;
  pageInfo: PageInfo | null;
  realm: Realm;
  currency: Currency;
  domain: string;
  baseUrl: string;
}

export const openSignTransactionModal = async ({
  method,
  network,
  transaction,
  transport,
  wallet,
  dispatch,
  pageInfo,
  realm,
  currency,
  domain,
  baseUrl,
}: Options) => {
  const preparedTransaction = await transport.prepareTransaction(network, wallet, (await getWalletStorage(realm, wallet, true)) as WalletStorage<unknown>, {
    ...transaction,
    dAppOrigin: baseUrl,
  });

  if (preparedTransaction.isError) {
    throw new Error('Transaction simulation failed');
  }

  const warning = getWarningFromSimulation(preparedTransaction.preventativeAction, preparedTransaction.warnings);
  const classifiedTransaction = await classifyTransaction(preparedTransaction.effects);
  const { transactionTitle, content } = await getSignStructuredParamsFromTransaction({
    method,
    preparedTransaction,
    network,
    currency,
  });
  const { approveSignRequest, fee } = await navigateToSignStructuredTransactionPage({
    dispatch,
    wallet,
    metadata: {
      imageUrl: pageInfo?.iconUrl,
      name: pageInfo?.title ?? domain,
      url: baseUrl,
    },
    transactionTitle,
    content,
    detailsContent: adaptTransactionObjectToDefinitionList(transaction, network),
    preparedTransaction,
    hideFeeSelector: classifiedTransaction.type === TRANSACTION_TYPES.TOKEN_APPROVAL,
    warning,
  });

  return { approveSignRequest, fee };
};
