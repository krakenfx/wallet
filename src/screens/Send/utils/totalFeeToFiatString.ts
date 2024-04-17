import { RealmishWallet, TotalFee } from '@/onChain/wallets/base';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { Currency } from '@/screens/Settings/currency';
import { calculateBalance } from '@/utils/calculateBalance';

import { formatAppCurrencyValue, tokenAmountShortened } from '/modules/text-utils';

export const totalFeeToFiatString = (currency: Currency, fee?: TotalFee, wallet?: RealmishWallet, price?: number): string => {
  if (!fee || !wallet || !price) {
    return '';
  }

  const { network } = getImplForWallet(wallet);

  return formatAppCurrencyValue(
    String(
      calculateBalance({
        balance: fee.amount,
        decimals: network.nativeTokenDecimals,
        price,
      }),
    ),
    currency,
  );
};

export function totalFeeToFiatStringSafe(currency: Currency, fee?: TotalFee, wallet?: RealmishWallet, price?: number) {
  if (!price && wallet && fee) {
    const { network } = getImplForWallet(wallet);

    if (network.nativeTokenCaipId === fee.token) {
      const formattedAmount = tokenAmountShortened({
        balance: fee.amount,
        metadata: {
          decimals: network.nativeTokenDecimals,
        },
      });
      return `${formattedAmount} ${network.nativeTokenSymbol}`;
    }
  }

  return totalFeeToFiatString(currency, fee, wallet, price);
}
