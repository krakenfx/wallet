import type { DefiAssetsListItem } from '../DefiFlatList/DefiFlatList.types';

export interface DefiAssetRowProps {
  asset: DefiAssetsListItem;
  onSelect: (asset: DefiAssetsListItem) => void;
}
