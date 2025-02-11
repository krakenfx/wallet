import type { SharedValue } from 'react-native-reanimated';

export interface DefiEarnSheetHeaderProps {
  assetId: string;
  closeEarnSheet: () => void;
  isHeaderShrunk: SharedValue<boolean>;
}

export interface UseSheetHeaderAnimationProps {
  tokenAmountFormatted: string;
  isHeaderShrunk: SharedValue<boolean>;
}
