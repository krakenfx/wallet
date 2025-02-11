import bs58 from 'bs58';
import { useCallback, useMemo } from 'react';

import { getImplForWallet } from '@/onChain/wallets/registry';
import type { SolanaHarmonyTransport } from '@/onChain/wallets/solana.ts';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';

import { type OpenSignSolanaMessageDialogArgs, useOpenSignSolanaMessageDialog } from './useOpenSignSolanaMessageDialog';
import { type OpenSignSolanaTransactionDialogArgs, useOpenSignSolanaTransactionDialog } from './useOpenSignSolanaTransactionDialog';

import { isSolanaNetwork, isSolanaTransport } from '/modules/wallet-connect/utils';

export const useSolanaSignRequests = () => {
  const openSignMessageDialog = useOpenSignSolanaMessageDialog();
  const openSignTransactionDialog = useOpenSignSolanaTransactionDialog();
  const { getSeed } = useSecuredKeychain();

  const signSolanaMessage = useCallback(
    async (args: OpenSignSolanaMessageDialogArgs) => {
      const approved = await openSignMessageDialog(args);

      if (!approved) {
        return null;
      }

      const seed = await getSeed('sign');

      if (seed === false) {
        return null;
      }

      const { network } = getImplForWallet(args.wallet);

      if (!isSolanaNetwork(network)) {
        throw new Error(`Can't sign a Solana message with a non-Solana wallet`);
      }

      const result = await network.signMessage({ ...args.wallet, seed: { data: seed } }, bs58.encode(args.message));

      return Buffer.from(bs58.decode(result.signature)).toString('hex');
    },
    [openSignMessageDialog, getSeed],
  );

  const signSolanaTransaction = useCallback(
    async (args: OpenSignSolanaTransactionDialogArgs) => {
      const { approved, preparedTransactions } = await openSignTransactionDialog(args);

      if (!approved) {
        return null;
      }

      const seed = await getSeed('sign');

      if (seed === false) {
        return null;
      }

      const { network } = getImplForWallet(args.wallet);

      if (!isSolanaNetwork(network)) {
        throw new Error(`Can't sign Solana transactions with a non-Solana wallet`);
      }

      return Promise.all(preparedTransactions.map(t => network.signTransaction({ ...args.wallet, seed: { data: seed } }, t.data)));
    },
    [openSignTransactionDialog, getSeed],
  );

  const signAndSendSolanaTransaction = useCallback(
    async (args: OpenSignSolanaTransactionDialogArgs) => {
      const signedTransactions = await signSolanaTransaction(args);

      if (signedTransactions === null) {
        return null;
      }

      const impl = getImplForWallet(args.wallet);

      if (!isSolanaTransport(impl.transport)) {
        throw new Error(`Can't broadcast a Solana transaction with a non-Solana transport`);
      }

      const transport: SolanaHarmonyTransport = impl.transport;

      return Promise.all(signedTransactions.map(t => transport.broadcastTransaction(impl.network, t)));
    },
    [signSolanaTransaction],
  );

  return useMemo(
    () => ({
      signSolanaMessage,
      signSolanaTransaction,
      signAndSendSolanaTransaction,
    }),
    [signSolanaMessage, signSolanaTransaction, signAndSendSolanaTransaction],
  );
};
