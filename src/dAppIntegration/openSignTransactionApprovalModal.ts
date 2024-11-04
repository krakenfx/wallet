import type { PageInfo, RpcMethods } from '@/dAppIntegration/types';
import type { EVMHarmonyTransport, EVMNetwork } from '@/onChain/wallets/evm';

import { type WalletStorage, getWalletStorage } from '@/onChain/wallets/walletState';
import { TRANSACTION_TYPES } from '@/realm/transactions/const';
import type { RealmWallet } from '@/realm/wallets';
import type { Currency } from '@/screens/Settings/currency';

import type { Verify } from '@walletconnect/types';
import type Realm from 'realm';

import { handleError } from '/helpers/errorHandler';
import type { ReactNavigationDispatch } from '/modules/wallet-connect';
import { getWarningFromSimulation } from '/modules/wallet-connect/utils';
import { type TransactionObject, adaptTransactionObjectToDefinitionList, classifyTransaction } from '/modules/wallet-connect/web3Wallet/ethereum';
import {
  getSignStructuredParamsFromTransaction,
  navigateToSignStructuredTransactionPage,
} from '/modules/wallet-connect/web3Wallet/navigateToSignStructuredTransactionPage';

interface Options {
  method: RpcMethods;
  network: EVMNetwork;
  transaction: TransactionObject;
  transport: EVMHarmonyTransport;
  wallet: RealmWallet;
  dispatch: ReactNavigationDispatch;
  pageInfo: PageInfo;
  realm: Realm;
  currency: Currency;
  verified?: Verify.Context['verified']; 
}

export const openSignTransactionModal = async ({ method, network, transaction, transport, verified, wallet, dispatch, pageInfo, realm, currency }: Options) => {
  let preparedTransaction;
  try {
    preparedTransaction = await transport.prepareTransaction(network, wallet, (await getWalletStorage(realm, wallet, true)) as WalletStorage<unknown>, {
      ...transaction,
      dAppOrigin: verified?.origin,
    });
  } catch {
    
    console.log('prepareTransaction failed');
  }

  if (!preparedTransaction || preparedTransaction.isError) {
    
    return handleError('Response rejected', 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
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
      imageUrl: pageInfo.icon,
      name: '',
      url: pageInfo.url,
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
