import type { SessionProposal } from '@/screens/ConnectApp/types';

import { getRequiresWrongSolanaID } from './getRequiresWrongSolanaID';

import type { ProposalTypes } from '@walletconnect/types';

import { SHIM_replaceWrongSolanaMainnetID } from '/modules/wallet-connect/solanaShim';
import { isCAIP2 } from '/modules/wallet-connect/utils';

export function getRequestedNetworkIDs(sessionProposal: SessionProposal): {
  requestedNetworkIDs: string[];
  requestedRequiredNetworkIDs: string[];
  requiresWrongSolanaID: boolean;
} {
  const requestedNetworkIDs: string[] = [];
  const requestedRequiredNetworkIDs: string[] = [];

  const assignRequestedNetworkIDs = (namespaceKey: string, namespace: ProposalTypes.BaseRequiredNamespace, isRequired: boolean) => {
    const isKeyCAIP2 = isCAIP2(namespaceKey);

    
    
    (isKeyCAIP2 ? [namespaceKey] : namespace.chains || []).map(chain => {
      if (chain) {
        const id = SHIM_replaceWrongSolanaMainnetID(chain);

        if (!requestedNetworkIDs.includes(id)) {
          requestedNetworkIDs.push(id);

          if (isRequired) {
            requestedRequiredNetworkIDs.push(id);
          }
        }
      }
    });
  };

  Object.entries(sessionProposal.params?.requiredNamespaces ?? {}).forEach(([k, v]) => assignRequestedNetworkIDs(k, v, true ));
  Object.entries(sessionProposal.params?.optionalNamespaces ?? {}).forEach(([k, v]) => assignRequestedNetworkIDs(k, v, false));

  return {
    requiresWrongSolanaID: getRequiresWrongSolanaID(sessionProposal),
    requestedNetworkIDs,
    requestedRequiredNetworkIDs,
  };
}
