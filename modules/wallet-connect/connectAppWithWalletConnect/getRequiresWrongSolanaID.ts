import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import type { SessionProposal } from '@/screens/ConnectApp/types';

import { SOLANA_MAINNET_ID_WRONG } from '/modules/wallet-connect/solanaShim';
import { isCAIP2 } from '/modules/wallet-connect/utils';

export function getRequiresWrongSolanaID(sessionProposal: SessionProposal) {
  const requiredSolanaChains = Object.entries(sessionProposal.params?.requiredNamespaces ?? {})
    .filter(([k]) => {
      return k.startsWith('solana');
    })
    .flatMap(([k, requiredNamespace]) => (isCAIP2(k) ? [k] : requiredNamespace.chains || []));

  const optionalSolanaChains = Object.entries(sessionProposal.params?.optionalNamespaces ?? {})
    .filter(([k]) => {
      return k.startsWith('solana');
    })
    .flatMap(([k, optionalNamespace]) => (isCAIP2(k) ? [k] : optionalNamespace.chains || []));

  const onlyRequiresWrongSolanaID = requiredSolanaChains.includes(SOLANA_MAINNET_ID_WRONG) && !requiredSolanaChains.includes(ChainAgnostic.NETWORK_SOLANA);
  const onlyOptionalWrongSolanaID =
    optionalSolanaChains.includes(SOLANA_MAINNET_ID_WRONG) &&
    !optionalSolanaChains.includes(ChainAgnostic.NETWORK_SOLANA) &&
    !requiredSolanaChains.includes(ChainAgnostic.NETWORK_SOLANA);

  const requiresWrongSolanaID = onlyRequiresWrongSolanaID || onlyOptionalWrongSolanaID;

  return requiresWrongSolanaID;
}
