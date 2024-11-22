import { untilSecondColon } from '@/utils/stringUtils';

function getChainsForSessionNamespace(accountsFromMatchedWallets: string[], networkPrefix: string) {
  const chains = accountsFromMatchedWallets
    .map(account => {
      if (account.startsWith(networkPrefix)) {
        const chain = account.match(untilSecondColon);

        if (chain) {
          return chain.join('');
        }
      }

      return undefined;
    })
    .filter(chain => chain !== undefined);

  return chains;
}

export function getChainsSolana(accountsFromMatchedWallets: string[]) {
  return getChainsForSessionNamespace(accountsFromMatchedWallets, 'solana:');
}

export function getChainsEip155(accountsFromMatchedWallets: string[]) {
  return getChainsForSessionNamespace(accountsFromMatchedWallets, 'eip155:');
}
