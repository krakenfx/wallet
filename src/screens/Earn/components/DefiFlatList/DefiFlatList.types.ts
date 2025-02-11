import type { WalletType } from '@/onChain/wallets/registry';

import type { DefiProtocol } from '../DefiAssetProtocolRow/DefiAssetProtocolRow.types';

export enum SectionName {
  HighlightHero,
  AssetsListHeader,
  DepositOptionsCarousel,
  AssetsList,
  AssetsListItem,
  AssetsListItemSkeleton,
  AssetsListError,
}

export interface Section {
  section: SectionName;
}

export type DefiAssetsListItem = {
  assetId: string;
  assetName: string;
  assetSymbol: string;
  assetNetwork: WalletType;
  maxAPY: number;
  protocols: DefiProtocol[];
};

export type Data = { key: string } & (
  | {
      type:
        | SectionName.HighlightHero
        | SectionName.DepositOptionsCarousel
        | SectionName.AssetsListHeader
        | SectionName.AssetsListItemSkeleton
        | SectionName.AssetsListError;
    }
  | { type: SectionName.AssetsListItem; asset: DefiAssetsListItem }
);
