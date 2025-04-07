import { type Dispatch, type PropsWithChildren } from 'react';

import React, { useContext, useMemo, useState } from 'react';

import type { Position } from '@/components/DefiProtocolPositions/DefiProtocolPositions.types';
import type { WalletType } from '@/onChain/wallets/registry';
import { useDefiPositionQuery } from '@/reactQuery/hooks/earn/useDefiPositionsQuery';
import { useVaultInfoQuery } from '@/reactQuery/hooks/earn/useVaultInfoQuery';
import { useAssetMarketData } from '@/realm/assetMarketData';
import { useAppCurrency } from '@/realm/settings';
import { type PriceHistoryPeriod, useTokenPrice } from '@/realm/tokenPrice';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';

import { capitalizeFirstLetter } from '/helpers/capitalizeFirstLetter';

export type DefiDetailsContext = {
  assetAddress: string;
  assetDecimals?: number;
  assetId: string;
  assetMarketCap: string;
  assetName: string;
  assetNetwork: WalletType;
  assetPrice: string;
  assetSymbol: string;
  chartMetric: 'apy' | 'tvl';
  isPending: boolean;
  period: PriceHistoryPeriod;
  position?: Position;
  protocolDescription?: string;
  protocolLogo: string;
  protocolName: string;
  setChartMetric: Dispatch<React.SetStateAction<'apy' | 'tvl'>>;
  setPeriod: Dispatch<React.SetStateAction<PriceHistoryPeriod>>;
  vaultAddress: string;
  vaultAssetsLocked: string;
  vaultLink: string;
  vaultName: string;
  vaultNetwork: string;
  vaultNumberOfHolders: string;
  vaultProtocol: string;
  vaultTokenSymbol: string;
  vaultType: string;
};

const DefiDetailsContext = React.createContext<DefiDetailsContext | undefined>(undefined);

type ContextProps = {
  assetId: string;
  protocolLogo: string;
  vaultNetwork: WalletType;
  vaultAddress: string;
};

export const DefiDetailsContextProvider: React.FC<PropsWithChildren<ContextProps>> = ({ children, assetId, protocolLogo, vaultNetwork, vaultAddress }) => {
  const { currency } = useAppCurrency();
  const [chartMetric, setChartMetric] = useState<'apy' | 'tvl'>('apy');
  const [period, setPeriod] = useState<PriceHistoryPeriod>('WEEK');
  const { data: position, isPending: isPendingPosition } = useDefiPositionQuery(vaultAddress);

  const { data: vault, isPending: isPendingVaultInfo } = useVaultInfoQuery(vaultAddress, vaultNetwork);
  const assetsLocked = vault
    ? formatTokenAmount(String((Number(vault.tvlDetails.lockedUsd) / Number(vault.tvlDetails.tvlUsd)) * 100), { currency }) + '%'
    : undefined;
  const vaultNumberOfHoldersFormatted = vault ? formatTokenAmount(String(vault.numberOfHolders), { currency }) : '-';

  const tokenPrice = useTokenPrice({ assetId, refresh: true });
  const tokenPriceFormatted = tokenPrice ? formatCurrency(tokenPrice, { compact: true, currency, findFirstNonZeroDigits: true }) : undefined;
  const assetMarketData = useAssetMarketData({ assetId, refresh: true });
  const marketCapFormatted = assetMarketData?.marketCap ? formatTokenAmount(String(assetMarketData.marketCap), { compact: true, currency }) : undefined;
  const assetNetwork = (vault?.network === 'mainnet' ? 'ethereum' : (vault?.network ?? 'ethereum')) as WalletType;
  const assetSymbol = vault?.token.symbol.toUpperCase() ?? '-';

  const protocolNameCapitalized = vault?.protocol.split(' ').map(capitalizeFirstLetter).join(' ') ?? '';
  const isPending = isPendingPosition || isPendingVaultInfo;

  const providerValue = useMemo(
    () => ({
      assetAddress: vault?.token.assetAddress ?? '-',
      assetDecimals: vault?.token.decimals,
      assetId,
      assetMarketCap: marketCapFormatted ?? '-',
      assetName: vault?.token.name ?? '-',
      assetNetwork,
      assetPrice: tokenPriceFormatted ?? '-',
      assetSymbol,
      chartMetric,
      isPending,
      period,
      position,
      protocolDescription: vault?.description ?? '',
      protocolLogo,
      protocolName: protocolNameCapitalized,
      setChartMetric,
      setPeriod,
      vaultAddress,
      vaultAssetsLocked: assetsLocked ?? '-',
      vaultLink: vault?.lendLink ?? '-',
      vaultName: vault?.name ?? '-',
      vaultNetwork,
      vaultNumberOfHolders: vaultNumberOfHoldersFormatted,
      vaultProtocol: vault?.protocol ?? '-',
      vaultTokenSymbol: vault?.token.symbol ?? '-',
      vaultType: vault?.tags[0] ?? '-',
    }),
    [
      assetId,
      assetNetwork,
      assetSymbol,
      assetsLocked,
      chartMetric,
      isPending,
      marketCapFormatted,
      period,
      position,
      protocolLogo,
      protocolNameCapitalized,
      setChartMetric,
      setPeriod,
      tokenPriceFormatted,
      vault,
      vaultAddress,
      vaultNetwork,
      vaultNumberOfHoldersFormatted,
    ],
  );

  return <DefiDetailsContext.Provider value={providerValue}>{children}</DefiDetailsContext.Provider>;
};

export const useDefiDetailsContext = (): DefiDetailsContext => {
  const context = useContext(DefiDetailsContext);

  if (!context) {
    throw new Error('DefiDetailsContext not initialized');
  }

  return context;
};
