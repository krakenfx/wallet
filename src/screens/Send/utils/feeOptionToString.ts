import type { FeeOptionKind } from '@/api/types';

import loc from '/loc';

export const feeOptionToString = (kind: FeeOptionKind) => {
  switch (kind) {
    case 'fast':
      return loc.send.evm_fee_urgent;
    case 'medium':
      return loc.send.evm_fee_fast;
    case 'slow':
      return loc.send.evm_fee_normal;
    default:
      return 'unknown';
  }
};
