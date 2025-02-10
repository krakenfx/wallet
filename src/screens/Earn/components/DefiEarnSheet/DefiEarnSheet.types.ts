import type { DefiAssetsListItem } from '../DefiFlatList/DefiFlatList.types';

export enum SheetPosition {
  'MEDIUM' = 0,
  'HIGH' = 1,
}

export interface DefiEarnSheetProps {
  selectedAsset: DefiAssetsListItem | null;
  onCloseEarnSheet: () => void;
}
