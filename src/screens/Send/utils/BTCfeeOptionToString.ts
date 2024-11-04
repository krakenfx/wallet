import type { FeeOptionKind } from '@/api/types';

import loc from '/loc';

export const BTCfeeOptionToString = (kind: FeeOptionKind) => {
  switch (kind) {
    case 'fast':
      return loc.send.fee_fast;

    case 'medium':
      return loc.send.fee_medium;

    case 'slow':
      return loc.send.fee_slow;

    default:
      return 'unknown';
  }
};
