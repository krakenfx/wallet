import type { Warning } from '@/types';

import type { WalletKitTypes } from '@reown/walletkit';
import type { ProposalTypes } from '@walletconnect/types';

export type SessionProposal = Omit<WalletKitTypes.BaseEventArgs<ProposalTypes.Struct>, 'topic'>;

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
