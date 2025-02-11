import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { getImplForWallet } from '@/onChain/wallets/registry';
import type { SolanaHarmonyTransport } from '@/onChain/wallets/solana';
import { useAppCurrency } from '@/realm/settings';
import type { RealmWallet } from '@/realm/wallets';

import type { SolanaRpcMethod } from '../constants';
import type { SolSignTransactionParams } from '../schemas';
import type { PageInfo } from '../types';

import loc from '/loc';
import { getWarningFromSimulation, isSolanaTransport } from '/modules/wallet-connect/utils';
import {
  getSignStructuredParamsFromTransaction,
  navigateToSignStructuredTransactionPage,
} from '/modules/wallet-connect/web3Wallet/navigateToSignStructuredTransactionPage';

export type OpenSignSolanaTransactionDialogArgs = {
  wallet: RealmWallet;
  pageInfo: PageInfo | null;
  domain: string;
  baseUrl: string;
  params: SolSignTransactionParams;
  address: string;
  method: SolanaRpcMethod;
};

export const useOpenSignSolanaTransactionDialog = () => {
  const { dispatch } = useNavigation();
  const { currency } = useAppCurrency();

  return useCallback(
    async (args: OpenSignSolanaTransactionDialogArgs) => {
      const impl = getImplForWallet(args.wallet);

      if (!isSolanaTransport(impl.transport)) {
        throw new Error(`Can't prepare a Solana transaction with a non-Solana transport`);
      }

      const transport: SolanaHarmonyTransport = impl.transport;

      const base64Transactions = args.params.map(param => Buffer.from(param[0]).toString('base64'));
      const preparedTransactions = await Promise.all(
        base64Transactions.map(transaction =>
          transport.prepareTransaction(
            impl.network,
            args.wallet,

            undefined as any,
            {
              dAppOrigin: args.baseUrl,
              transaction,
            },
          ),
        ),
      );

      if (preparedTransactions.some(t => t.isError)) {
        throw new Error('Some of the transaction simulations failed');
      }

      const warning = preparedTransactions.map(t => getWarningFromSimulation(t.preventativeAction, t.warnings)).find(w => w !== undefined);
      const { transactionTitle, content } = await getSignStructuredParamsFromTransaction({
        method: args.method,
        preparedTransaction: preparedTransactions[0],
        network: impl.network,
        currency,
      });
      const { approveSignRequest: approved } = await navigateToSignStructuredTransactionPage({
        dispatch,
        wallet: args.wallet,
        metadata: {
          imageUrl: args.pageInfo?.iconUrl,
          name: args.pageInfo?.title ?? args.domain,
          url: args.baseUrl,
        },
        transactionTitle,
        content,

        detailsContent: base64Transactions.map((t, i) => ({
          title: loc.formatString(loc.appSignRequest.transactionBase64, { index: i + 1 }) as string,
          description: t,
        })),

        preparedTransaction: preparedTransactions[0],
        hideFeeSelector: true,
        warning,
      });

      return { approved, preparedTransactions };
    },
    [dispatch, currency],
  );
};
