import { NativeTokenSymbol } from '@/onChain/wallets/base';
import { Currency } from '@/screens/Settings/currency';
import { smallUnit2TokenUnit, tokenUnit2Fiat, tokenUnit2SmallestUnit } from '@/utils/unitConverter';

import { amountStringShortened, formatAppCurrencyValue } from '/modules/text-utils';

export const getDisplayNetworkFee = ({
  nativeTokenDecimals,
  nativeTokenSymbol,
  networkFee,
  tokenPrice,
  currency,
}: {
  nativeTokenDecimals: number;
  nativeTokenSymbol: NativeTokenSymbol;
  networkFee?: string | null;
  tokenPrice?: number;
  currency: Currency;
}) => {
  switch (nativeTokenSymbol) {
    case 'BTC': {
      return {
        amount: networkFee ? tokenUnit2SmallestUnit(networkFee, nativeTokenDecimals).toString(10) + ' Sats' : '',
        price: networkFee && tokenPrice ? formatAppCurrencyValue(tokenUnit2Fiat(networkFee, tokenPrice)?.toString(10), currency) : '',
      };
    }
    case 'DOGE': {
      return {
        amount: networkFee ? smallUnit2TokenUnit(networkFee, nativeTokenDecimals).toString(10) + ' Doge' : '',
        price:
          networkFee && tokenPrice
            ? formatAppCurrencyValue(tokenUnit2Fiat(smallUnit2TokenUnit(networkFee, nativeTokenDecimals), tokenPrice)?.toString(10), currency)
            : '',
      };
    }
    case 'SOL': {
      return {
        amount: networkFee ? smallUnit2TokenUnit(networkFee, nativeTokenDecimals).toString(10) + ' Sol' : '',
        price: '',
      };
    }

    default: {
      return {
        amount: networkFee ? amountStringShortened(smallUnit2TokenUnit(networkFee, 9).toString(10), 0) + ' Gwei' : '',
        price: networkFee ? amountStringShortened(smallUnit2TokenUnit(networkFee, nativeTokenDecimals).toString(10)) + ' ' + nativeTokenSymbol : '',
      };
    }
  }
};
