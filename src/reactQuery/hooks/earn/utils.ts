import type { BestVaultResult, DepositOptionsResult, Vault } from '@/api/types';
import type { CardData } from '@/components/DepositOptionsCarousel/DepositOptionsCarousel.types';
import type { DefiAssetsListItem } from '@/screens/Earn/components/DefiFlatList/DefiFlatList.types';
import type { HighlightVault } from '@/screens/Earn/components/DefiHighlightHeroContent/DefiHighlightHeroContent.types';

import { adaptAssetNetworkToWalletType } from '@/utils/adaptAssetNetworkToWalletType';
import { adaptDepositOptionToCardData } from '@/utils/adaptDepositOptionToCardData';

const DEFAULT_FALLBACK_ASSET = 'ETH';

export const formatTopOpportunity = (data: BestVaultResult | null): HighlightVault | null => {
  if (!data) {
    return null;
  }

  const { asset, vault } = data;
  return {
    assetId: asset.assetCaip,
    assetAddress: asset.assetAddress,
    assetSymbol: asset?.symbol ?? DEFAULT_FALLBACK_ASSET,
    assetNetwork: adaptAssetNetworkToWalletType(asset.networkName),
    apy: vault.apy.total / 100,
    tvlInUsd: vault.tvlInUsd,
    protocolName: vault.protocol.name,
    protocolLogoUrl: vault.protocol.protocolLogo,
  };
};

export const formatAssetListData = (depositOptions: DepositOptionsResult): DefiAssetsListItem[] => {
  return depositOptions.userBalances.map(({ asset, depositOptions }) => ({
    assetId: asset.assetCaip,
    assetName: asset.name,
    assetSymbol: asset.symbol ?? DEFAULT_FALLBACK_ASSET,
    assetNetwork: adaptAssetNetworkToWalletType(asset.networkName),
    maxAPY: getMaxAPY(depositOptions),
    protocols: depositOptions.map(depositOption => ({
      name: depositOption.protocol.name,
      protocolLogo: depositOption.protocol.protocolLogo,
      apy: depositOption.apy.total / 100,
      tvlInUsd: depositOption.tvlInUsd,
    })),
  }));
};

function getMaxAPY(depositOptions: Vault[]) {
  let maxAPY = 0;

  for (const depositOption of depositOptions) {
    if (depositOption.apy.total > maxAPY) {
      maxAPY = depositOption.apy.total;
    }
  }

  return maxAPY / 100;
}

const MAX_CARDS = 30;

export const selectCardData = (depositOptions: DepositOptionsResult): CardData[] => {
  const options = depositOptions.userBalances.map(({ asset, depositOptions }) => {
    return depositOptions.map(depositOption => adaptDepositOptionToCardData(depositOption, asset));
  });

  if (options.length === 0) {
    return [];
  }

  return filterOutAndSelectRandomCards(options.flat());
};

const filterOutAndSelectRandomCards = (cards: CardData[]) => {
  const filteredCards = cards.filter(card => {
    const apyNum = Number(card.protocolApy.slice(0, -1));
    const isApyHalfPercent = apyNum >= 0.5;

    return isApyHalfPercent;
  });

  const filteredCardsLength = filteredCards.length;
  const randomCards = [];
  const prevRandomNumbers: number[] = [];

  for (let i = 0; i < MAX_CARDS; i++) {
    const randomNumber = Math.floor(Math.random() * filteredCardsLength);

    if (!prevRandomNumbers.includes(randomNumber)) {
      randomCards.push(filteredCards[randomNumber]);
      prevRandomNumbers.push(randomNumber);
    }
  }

  return randomCards;
};
