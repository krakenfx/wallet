import type { Asset, Vault } from '@/api/types';
import type { CardData } from '@/components/DepositOptionsCarousel/DepositOptionsCarousel.types';

import { adaptVaultsNetworkToWalletType } from './adaptVaultsNetworkToWalletType';

export function adaptDepositOptionToCardData(depositOption: Vault, asset: Asset): CardData {
  const assetNetwork = adaptVaultsNetworkToWalletType(asset.networkName);

  return {
    assetAddress: asset.assetAddress,
    assetCaipId: asset.assetCaip,
    assetName: asset.name,
    assetNetwork,
    assetSymbol: asset.symbol,
    protocolDescription: depositOption.protocol.description,
    protocolLogo: depositOption.protocol.protocolLogo,
    protocolName: `${depositOption.protocol.name} ${depositOption.protocol.version}`,
    protocolApy: `${(depositOption.apy.total / 100).toFixed(2)}%`,
    vaultAddress: depositOption.vaultAddress,
    vaultNetwork: adaptVaultsNetworkToWalletType(depositOption.networkName),
  };
}
