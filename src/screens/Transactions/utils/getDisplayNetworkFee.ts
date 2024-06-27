import { NativeTokenSymbol } from '@/onChain/wallets/base';
import { Currency } from '@/screens/Settings/currency';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { smallUnit2TokenUnit, tokenUnit2Fiat, tokenUnit2SmallestUnit } from '@/utils/unitConverter';

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
        price: networkFee && tokenPrice ? formatCurrency(tokenUnit2Fiat(networkFee, tokenPrice)?.toString(10), { currency, highPrecision: true }) : '',
      };
    }
    case 'DOGE': {
      return {
        amount: networkFee
          ? formatTokenAmount(smallUnit2TokenUnit(networkFee, nativeTokenDecimals).toString(10), { currency, highPrecision: true }) + ' Doge'
          : '',
        price:
          networkFee && tokenPrice
            ? formatCurrency(tokenUnit2Fiat(smallUnit2TokenUnit(networkFee, nativeTokenDecimals), tokenPrice)?.toString(10), { currency, highPrecision: true })
            : '',
      };
    }
    case 'SOL': {
      return {
        amount: networkFee
          ? formatTokenAmount(smallUnit2TokenUnit(networkFee, nativeTokenDecimals).toString(10), { currency, highPrecision: true }) + ' Sol'
          : '',
        price: '',
      };
    }

    default: {
      return {
        amount: networkFee ? formatTokenAmount(smallUnit2TokenUnit(networkFee, 9).toString(10), { currency, highPrecision: true }) + ' Gwei' : '',
        price: networkFee
          ? formatTokenAmount(smallUnit2TokenUnit(networkFee, nativeTokenDecimals).toString(10), { currency, highPrecision: true }) + ' ' + nativeTokenSymbol
          : '',
      };
    }
  }
};
