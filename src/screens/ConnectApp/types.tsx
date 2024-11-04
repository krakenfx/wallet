import type { Warning } from '@/types';

import type { ProposalTypes } from '@walletconnect/types';
import type { Web3WalletTypes } from '@walletconnect/web3wallet';

export type SessionProposal = Omit<Web3WalletTypes.BaseEventArgs<ProposalTypes.Struct>, 'topic'>;

export const enum UI_STATE {
  none = 'none',
  loading = 'loading',
  complete = 'complete',
}

export type _3rdPartyData = Partial<{
  appMetadata: {
    url: string;
    name: string;
    icon: string;
  };
  approveSession: () => Promise<void>;
  networkIDs: string[];
  requiredNetworkIDs: string[];
  rejectSession: () => Promise<void>;
}>;

export type Verification = {
  isDomainMatch: boolean;
  warning?: Warning;
};
