import { addSeconds, formatDistanceStrict } from 'date-fns';
import { useMemo } from 'react';

import { useAppCurrency } from '@/realm/settings';

import { useTokenPriceGetter } from '@/realm/tokenPrice';
import { Currency } from '@/screens/Settings/currency';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { isBtc } from '@/utils/isBtc';
import { unitConverter } from '@/utils/unitConverter';

import { useSwapContext } from '../components/SwapContext';

import { mergeFees } from '../utils/mergeFees';

import type { SwapRouteUIData } from '../types';

import { getDateLocale } from '/loc/date';

export const useSwapRouteData = (): SwapRouteUIData | undefined => {
  const {
    swapQuoteState: [swapQuoteResult],
    sourceTokenState: [sourceAsset],
    sourceAmountSmallestUnitState: [sourceAssetAmount],
    targetAssetState: [targetAsset],
    swapFeesFiatValueState: [feeFiatValues],
  } = useSwapContext();

  const { currency } = useAppCurrency();

  const { getTokenPrice } = useTokenPriceGetter(Currency.USD);

  return useMemo(() => {
    if (!swapQuoteResult || !sourceAsset || !targetAsset || !sourceAssetAmount) {
      return undefined;
    }

    const quote = swapQuoteResult.quote;
    const output = quote.to.amount ?? '0';
    const minOutput = quote.minAmountOut ?? '0';

    const sourceAssetPrice = getTokenPrice(sourceAsset.assetId);
    const targetAssetPrice = getTokenPrice(targetAsset.assetId);

    let rate: string | undefined;

    if (sourceAssetPrice && targetAssetPrice) {
      const ratio = sourceAssetPrice / targetAssetPrice;
      const ratioToFormatted = formatTokenAmount(String(ratio), {
        compact: true,
        currency,
        highPrecision: true,
        isBtc: isBtc({ assetId: targetAsset.assetId }),
      });
      rate = `1 ${sourceAsset.metadata.symbol} ≈ ${ratioToFormatted} ${targetAsset.metadata.symbol}`;
    }

    const minOutputFormatted = formatTokenAmount(unitConverter.smallUnit2TokenUnit(minOutput, targetAsset.metadata.decimals).toString(10), {
      compact: true,
      currency,
      highPrecision: true,
      isBtc: isBtc({ assetId: targetAsset.assetId }),
    });

    const fees = mergeFees(quote.route.txSteps);

    const now = Date.now();
    const durationFormatted = quote.route.timeEstimate
      ? formatDistanceStrict(addSeconds(now, quote.route.timeEstimate), now, {
          locale: getDateLocale(),
        })
      : undefined;

    const feesTotal = feeFiatValues ? Object.values(feeFiatValues).reduce((a, b) => a + b, 0) : undefined;

    return {
      sourceAsset,
      sourceAssetAmount,
      targetAsset,
      rate,
      output,
      minOutput,
      minOutputFormatted,
      slippage: quote.swapSlippage ? `${quote.swapSlippage.toFixed(2)}%` : undefined,
      transactionFeesTotalFiat: feesTotal ? formatCurrency(feesTotal, { currency }) : '-',
      fees,
      steps: quote.route.txSteps,
      duration: durationFormatted,
    };
  }, [currency, feeFiatValues, getTokenPrice, sourceAsset, sourceAssetAmount, swapQuoteResult, targetAsset]);
};
