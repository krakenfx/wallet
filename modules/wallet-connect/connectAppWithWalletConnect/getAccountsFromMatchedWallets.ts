import { getImplForWallet } from '@/onChain/wallets/registry';
import type { RealmWallet } from '@/realm/wallets';

import { createErrorHandlerWithContext } from '/helpers/errorHandler';
import { SOLANA_MAINNET_ID_WRONG } from '/modules/wallet-connect/solanaShim';
import { isEVMNetwork, isSolanaNetwork } from '/modules/wallet-connect/utils';

export async function getAccountsFromMatchedWallets(
  matchedWallets: RealmWallet[],
  requiresWrongSolanaID: boolean, 
): Promise<{ eip155: string[]; solana: string[] }> {
  const accountsFromMatchedWallets: { eip155: string[]; solana: string[] } = { eip155: [], solana: [] };

  await Promise.all(
    matchedWallets.map(async wallet => {
      const network = getImplForWallet(wallet).network;

      if (isEVMNetwork(network)) {
        const address = await network.deriveAddress(wallet).catch(createErrorHandlerWithContext('ERROR_CONTEXT_PLACEHOLDER'));

        accountsFromMatchedWallets.eip155.push(`eip155:${network.chainId}:${address}`);
      }

      if (isSolanaNetwork(network)) {
        const address = await network.deriveAddress(wallet).catch(createErrorHandlerWithContext('ERROR_CONTEXT_PLACEHOLDER'));

        
        accountsFromMatchedWallets.solana.push(`${requiresWrongSolanaID ? SOLANA_MAINNET_ID_WRONG : network.caipId}:${address}`);
      }
    }),
  );

  return accountsFromMatchedWallets;
}
