import { FeeOptionKind } from '@/api/types';

import loc from '/loc';

export const feeOptionToString = (optionKind: FeeOptionKind) => {
  switch (optionKind) {
    case 'fast':
      return loc.send.fee_fast;
    case 'medium':
    case 'default':
      return loc.send.fee_medium;
    case 'slow':
      return loc.send.fee_slow;
    default:
      return 'unknown';
  }
};
