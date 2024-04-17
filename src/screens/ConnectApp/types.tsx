import { ProposalTypes } from '@walletconnect/types';
import { Web3WalletTypes } from '@walletconnect/web3wallet';

import { Warning } from '@/types';

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
  isScam: boolean;
  warning?: Warning;
};
