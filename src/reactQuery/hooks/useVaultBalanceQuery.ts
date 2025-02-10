import { type PositionsResult, type VaultBalance, usePositionsQuery } from './usePositionsQuery';

const selectVaultBalance = (vaultAddress: string, vaultNetwork: string): ((data: PositionsResult) => VaultBalance | undefined) => {
  return (data: PositionsResult) => {
    const vaultBalance = (data[vaultNetwork] || []).find(d => d.vaultAddress === vaultAddress);

    return vaultBalance;
  };
};

export const useVaultBalanceQuery = (vaultAddress: string, vaultNetwork: string) =>
  usePositionsQuery<VaultBalance | undefined>(selectVaultBalance(vaultAddress, vaultNetwork));
