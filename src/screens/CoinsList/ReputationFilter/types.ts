import type { REPUTATION } from '@/hooks/useReputation';

export type ReputationFilters = {
  [REPUTATION.UNVERIFIED]: boolean;
  [REPUTATION.BLACKLISTED]: boolean;
};
