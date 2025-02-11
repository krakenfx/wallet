import { useAppCurrencyValue } from '@/hooks/useAppCurrencyValue';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useAppCurrency } from '@/realm/settings';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { unitConverter } from '@/utils/unitConverter';

interface UseFormattedPositionAmountsProps {
  token: {
    assetId: string;
    balance: string;
    decimals: number | undefined;
  };
}

export const useFormattedPositionAmounts = ({ token }: UseFormattedPositionAmountsProps) => {
  const { currency } = useAppCurrency();
  const tokenAmount = token.decimals ? unitConverter.smallUnit2TokenUnit(token.balance, token.decimals).toString(10) : '';

  const formattedTokenAmount = useBalanceDisplay(
    formatTokenAmount(tokenAmount, {
      compact: true,
      currency,
      highPrecision: false,
    }),
  );

  const assetFiatAmount = useAppCurrencyValue(token.decimals ? { assetId: token.assetId, metadata: { decimals: token.decimals } } : undefined, token.balance);
  const formattedFiatAmount = useBalanceDisplay(assetFiatAmount ? formatCurrency(assetFiatAmount, { currency }) : '');

  return { formattedFiatAmount, formattedTokenAmount };
};
