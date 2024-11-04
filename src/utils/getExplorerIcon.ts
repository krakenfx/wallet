import type { IconName } from '@/components/SvgIcon';

export const getExplorerIcon = (label: string): IconName => {
  const lowerCaseLabel = label.toLowerCase();
  if (label === '3pxl') {
    return 'threexpl';
  }
  const labelsWithSameIconNames: IconName[] = [
    'mempool',
    'etherscan',
    'ethplorer',
    'polygonscan',
    'dexguru',
    'arbiscan',
    'basescan',
    'blockscout',
    'solscan',
    'solanafm',
  ];

  if (labelsWithSameIconNames.includes(lowerCaseLabel as IconName)) {
    return lowerCaseLabel as IconName;
  }

  return 'placeholder-explorer';
};
