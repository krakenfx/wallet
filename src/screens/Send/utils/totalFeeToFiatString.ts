import { RealmishWallet, TotalFee } from '@/onChain/wallets/base';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { Currency } from '@/screens/Settings/currency';
import { calculateBalance } from '@/utils/calculateBalance';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmountFromToken } from '@/utils/formatTokenAmountFromToken';
import { isBtc } from '@/utils/isBtc';


export const totalFeeToFiatString = (currency: Currency, fee?: TotalFee, wallet?: RealmishWallet, price?: number): string => {
  if (!fee || !wallet || !price) {
    return '';
  }

  const { network } = getImplForWallet(wallet);

  return formatCurrency(
    String(
      calculateBalance({
        balance: fee.amount,
        decimals: network.nativeTokenDecimals,
        price,
      }),
    ),
    { currency },
  );
};


export function totalFeeToFiatStringSafe(currency: Currency, fee?: TotalFee, wallet?: RealmishWallet, price?: number) {
  if (!price && wallet && fee) {
    
    
    
    
    const { network } = getImplForWallet(wallet);

    if (network.nativeTokenCaipId === fee.token) {
      const token = {
        balance: fee.amount,
        metadata: {
          decimals: network.nativeTokenDecimals,
        },
      };
      const tokenAmountFormatted = formatTokenAmountFromToken(token, { currency, highPrecision: true, isBtc: isBtc({ walletType: wallet.type }) });

      return `${tokenAmountFormatted} ${network.nativeTokenSymbol}`;
    }
  }

  return totalFeeToFiatString(currency, fee, wallet, price);
}
