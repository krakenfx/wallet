import type { FeeOption, FeeOptionKind } from '@/api/types';
import type { RealmishWallet } from '@/onChain/wallets/base';
import { getImplForWallet } from '@/onChain/wallets/registry';
import type { Currency } from '@/screens/Settings/currency';
import { formatTokenAmountFromToken } from '@/utils/formatTokenAmountFromToken';

import { BTCfeeOptionToString } from './BTCfeeOptionToString';
import { feeOptionToString } from './feeOptionToString';
import { feeRateToString } from './feeRateToString';

import { getFeeOptionAmount } from './getFeeOptionAmount';
import { getTimeEstimate } from './getTimeEstimate';
import { totalFeeToFiatStringSafe } from './totalFeeToFiatString';

import type { FeeEstimationMap } from '../types';

export interface FeeOptionsData {
  id: FeeOptionKind;
  name: string;
  amount: string;
  duration?: string;
  rate?: string;
  disabled?: boolean;
}

export const getFeeOptionsData = (
  options: FeeOption[],
  wallet: RealmishWallet,
  feeEstimates: FeeEstimationMap,
  currency: Currency,
  price?: number,
  inputInFiat?: boolean,
): FeeOptionsData[] => {
  const { network } = getImplForWallet(wallet);

  return options.map((option, i) => {
    const isBtc = wallet.type === 'HDsegwitBech32';
    const amount = inputInFiat
      ? totalFeeToFiatStringSafe(currency, feeEstimates[option.kind], wallet, price)
      : `${(() => {
          const token = {
            balance: feeEstimates[option.kind].amount,
            metadata: {
              decimals: network.nativeTokenDecimals,
            },
          };
          const tokenAmountFormatted = formatTokenAmountFromToken(token, { currency, highPrecision: true, isBtc });

          return tokenAmountFormatted;
        })()} ${network.nativeTokenSymbol}`;

    const name = isBtc ? BTCfeeOptionToString(option.kind) : feeOptionToString(option.kind);

    const feeOption = getFeeOptionAmount(option);

    const rate = feeRateToString(feeOption, wallet);

    const duplicateIndex = options.findIndex((o, otherIndex) => otherIndex > i && getFeeOptionAmount(o) === feeOption);

    const disabled = duplicateIndex > i;

    const duration = option.estimatedTimeBlocks ? getTimeEstimate(wallet.type, option.estimatedTimeBlocks) : undefined;

    return {
      id: option.kind,
      duration,
      amount,
      name,
      rate,
      disabled,
    };
  });
};
