import { BalanceHeader } from '@/components/BalanceHeader';
import { useTokenBalanceConvertedToAppCurrency } from '@/hooks/useAppCurrencyValue';
import type { VaultBalance } from '@/reactQuery/hooks/usePositionsQuery';
import { useAppCurrency } from '@/realm/settings';
import { Currency, getCurrencyInfo } from '@/screens/Settings/currency';

import { DefiDetailsHeaderFooter } from './DefiDetailsHeaderFooter';

interface DefiDetailsHeaderBalanceProps {
  vaultBalance: VaultBalance;
}

export const DefiDetailsHeaderBalance = ({ vaultBalance }: DefiDetailsHeaderBalanceProps) => {
  const { currency, currencyInfo } = useAppCurrency();
  const token = {
    balance: vaultBalance.balanceNative,
    assetId: vaultBalance.asset.assetAddress,
    metadata: { decimals: vaultBalance.asset.decimals },
  };
  const fiatValue = useTokenBalanceConvertedToAppCurrency(token);
  const fiatValueDependentData = {
    currency,
    currencyInfo,
    fiatValue,
  };

  if (fiatValue === undefined) {
    fiatValueDependentData.currency = Currency.USD;
    fiatValueDependentData.currencyInfo = getCurrencyInfo(Currency.USD);
    fiatValueDependentData.fiatValue = Number(vaultBalance.balanceUsd);
  }

  return (
    <BalanceHeader
      currency={fiatValueDependentData.currency}
      currencyInfo={fiatValueDependentData.currencyInfo}
      fiatLast
      fiatValue={fiatValueDependentData.fiatValue}
      footer={DefiDetailsHeaderFooter}
      testIDs={['Balance-DefiDetailsScreen', 'AssetBalance-DefiDetailsScreen', 'FiatBalance-DefiDetailsScreen']}
      tokenAmount={vaultBalance.balanceNative}
      tokenSymbol={vaultBalance.asset.symbol}
      tokenId={vaultBalance.asset.assetAddress}
    />
  );
};
