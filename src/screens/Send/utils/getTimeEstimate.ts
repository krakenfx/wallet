import { addSeconds, formatDistanceStrict } from 'date-fns';

import type { WalletType } from '@/onChain/wallets/registry';

import { getDateLocale } from '/loc/date';

const timePerBlockInSecondsMap: Partial<Record<WalletType, number>> = {
  ethereum: 12,
  polygon: 12,
  arbitrum: 0.25,
  optimism: 2,
  blast: 2,
  base: 2,
  HDsegwitBech32: 10 * 60,
  linea: 2,
  avalanche: 2,
};

export const getTimeEstimate = (type: WalletType, estimatedTimeBlocks: number) => {
  const timePerBlockInSeconds = timePerBlockInSecondsMap[type];

  if (timePerBlockInSeconds && estimatedTimeBlocks) {
    const now = Date.now();
    return formatDistanceStrict(addSeconds(now, Math.max(1, estimatedTimeBlocks * timePerBlockInSeconds)), now, {
      locale: getDateLocale(),
    });
  }
};
