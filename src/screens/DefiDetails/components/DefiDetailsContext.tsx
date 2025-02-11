import { type Dispatch, type PropsWithChildren } from 'react';

import React, { useContext, useMemo, useState } from 'react';

import type { WalletType } from '@/onChain/wallets/registry';
import { type VaultBalance } from '@/reactQuery/hooks/usePositionsQuery';
import { useVaultBalanceQuery } from '@/reactQuery/hooks/useVaultBalanceQuery';
import { useVaultQuery } from '@/reactQuery/hooks/useVaultQuery';
import { useAssetMarketData } from '@/realm/assetMarketData';
import { useAppCurrency } from '@/realm/settings';
import { useTokenPrice } from '@/realm/tokenPrice';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';

import { capitalizeFirstLetter } from '/helpers/capitalizeFirstLetter';

export type DefiDetailsContext = {
  assetAddress: string;
  assetCaipId: string;
  assetMarketCap: string;
  assetName: string;
  assetNetwork: WalletType;
  assetPrice: string;
  assetSymbol: string;
  chartMetric: 'apy' | 'tvl';
  protocolDescription?: string;
  protocolLogo: string;
  protocolName: string;
  setChartMetric: Dispatch<React.SetStateAction<'apy' | 'tvl'>>;
  vaultAddress: string;
  vaultAssetsLocked: string;
  vaultBalance?: VaultBalance;
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
  assetAddress: string;
  assetCaipId: string;
  assetName: string;
  assetNetwork: WalletType;
  assetSymbol: string;
  protocolDescription?: string;
  protocolLogo: string;
  protocolName: string;
  vaultNetwork: WalletType;
  vaultAddress: string;
};

export const DefiDetailsContextProvider: React.FC<PropsWithChildren<ContextProps>> = ({
  children,
  assetAddress,
  assetCaipId,
  assetName,
  assetNetwork,
  assetSymbol,
  protocolDescription,
  protocolLogo,
  protocolName,
  vaultNetwork,
  vaultAddress,
}) => {
  const { currency } = useAppCurrency();
  const [chartMetric, setChartMetric] = useState<'apy' | 'tvl'>('apy');

  const { data: vaultBalance } = useVaultBalanceQuery(vaultAddress, vaultNetwork);
  const { data: vault } = useVaultQuery(vaultAddress, vaultNetwork);
  const assetsLocked = vault
    ? formatTokenAmount(String((Number(vault.tvlDetails.lockedUsd) / Number(vault.tvlDetails.tvlUsd)) * 100), { currency }) + '%'
    : undefined;

  const tokenPrice = useTokenPrice({ assetId: assetCaipId, refresh: true });
  const tokenPriceFormatted = tokenPrice ? formatCurrency(tokenPrice, { compact: true, currency, findFirstNonZeroDigits: true }) : undefined;
  const assetMarketData = useAssetMarketData({ assetId: assetCaipId, refresh: true });
  const marketCapFormatted = assetMarketData?.marketCap ? formatTokenAmount(String(assetMarketData.marketCap), { compact: true, currency }) : undefined;

  const protocolNameCapitalized = protocolName.split(' ').map(capitalizeFirstLetter).join(' ');

  const providerValue = useMemo(
    () => ({
      assetAddress,
      assetCaipId,
      assetMarketCap: marketCapFormatted ?? '-',
      assetName,
      assetNetwork,
      assetPrice: tokenPriceFormatted ?? '-',
      assetSymbol: assetSymbol.toUpperCase(),
      chartMetric,
      protocolDescription,
      protocolLogo,
      protocolName: protocolNameCapitalized,
      setChartMetric,
      vaultAddress,
      vaultAssetsLocked: assetsLocked ?? '-',
      vaultBalance,
      vaultLink: vault?.lendLink ?? '-',
      vaultName: vault?.name ?? '-',
      vaultNetwork,
      vaultNumberOfHolders: vault ? String(vault.numberOfHolders) : '-',
      vaultProtocol: vault?.protocol ?? '-',
      vaultTokenSymbol: vault?.token.symbol ?? '-',
      vaultType: vault?.tags[0] ?? '-',
    }),
    [
      assetAddress,
      assetCaipId,
      assetName,
      assetNetwork,
      assetsLocked,
      assetSymbol,
      chartMetric,
      marketCapFormatted,
      protocolDescription,
      protocolLogo,
      protocolNameCapitalized,
      setChartMetric,
      tokenPriceFormatted,
      vault,
      vaultAddress,
      vaultBalance,
      vaultNetwork,
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
