import type { WalletType } from '@/onChain/wallets/registry';
import { useFilteredDepositOptionsByAssetQuery } from '@/reactQuery/hooks/earn/useDepositOptionsQuery';
import { DefiEarnSheet } from '@/screens/Earn/components/DefiEarnSheet/DefiEarnSheet';

import type { AssetBalanceId } from '@/types';

export type TransactionsRouteProps = {
  assetBalanceId: AssetBalanceId;
};

type Props = {
  onCloseSheet: () => unknown;
  assetId: string;
  assetSymbol: string;
  walletType: WalletType;
};

export const TransactionsEarnSheet = ({ onCloseSheet, assetId, assetSymbol, walletType }: Props) => {
  const { data: depositOptionsAcrossNetworks, isPending } = useFilteredDepositOptionsByAssetQuery([], 0, 0, [assetSymbol]);
  const depositOptionsOfSameNetwork = (depositOptionsAcrossNetworks ?? []).filter(d => d.assetNetwork === walletType)[0];
  const { data: depositOptionsFallback, isPending: isPendingDepositOptionsFallback } = useFilteredDepositOptionsByAssetQuery([], 0);
  const fallbackDepositOptionsOfSameNetwork = (depositOptionsFallback ?? []).filter(d => d.assetNetwork === walletType)[0];

  if (isPending || isPendingDepositOptionsFallback) {
    return null;
  }

  const shouldUseFallbackContent = !isPending && (!depositOptionsAcrossNetworks || depositOptionsAcrossNetworks.length === 0);
  const primaryOptions = depositOptionsOfSameNetwork?.protocols;
  const crossNetworkOptions = depositOptionsAcrossNetworks?.[0]?.protocols ?? [];
  const fallbackOptions = fallbackDepositOptionsOfSameNetwork?.protocols ?? [];
  const protocols_ = shouldUseFallbackContent ? fallbackOptions : (primaryOptions ?? crossNetworkOptions);

  return <DefiEarnSheet assetId={assetId} protocols={protocols_} onCloseEarnSheet={onCloseSheet} />;
};
