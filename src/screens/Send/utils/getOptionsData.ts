import { FeeOption, FeeOptionKind } from '@/api/types';
import { RealmishWallet } from '@/onChain/wallets/base';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { Currency } from '@/screens/Settings/currency';

import { FeeEstimationMap } from '../types';
import { feeOptionToString } from '../utils/feeOptionToString';
import { feeRateToString } from '../utils/feeRateToString';
import { totalFeeToFiatStringSafe } from '../utils/totalFeeToFiatString';

import { BTCfeeOptionToString } from './BTCfeeOptionToString';
import { getFeeOptionAmount } from './getFeeOptionAmount';
import { getTimeEstimate } from './getTimeEstimate';

import { tokenAmountShortened } from '/modules/text-utils';

interface OptionsData {
  id: FeeOptionKind;
  labelLeft: string;
  labelRight: string;
  labelBottomLeft: string | undefined;
  labelBottomRight: string;
  disabled?: boolean;
}

export const getOptionsData = (
  options: FeeOption[],
  wallet: RealmishWallet,
  feeEstimates: FeeEstimationMap,
  currency: Currency,
  price?: number,
  inputInFiat?: boolean,
): OptionsData[] => {
  const { network } = getImplForWallet(wallet);

  return options.map((option, i) => {
    const labelRight = inputInFiat
      ? totalFeeToFiatStringSafe(currency, feeEstimates[option.kind], wallet, price)
      : `${tokenAmountShortened({
          balance: feeEstimates[option.kind].amount,
          metadata: {
            decimals: network.nativeTokenDecimals,
          },
        })} ${network.nativeTokenSymbol}`;

    const labelLeft = wallet.type === 'HDsegwitBech32' ? BTCfeeOptionToString(option.kind) : feeOptionToString(option.kind);

    const feeOption = getFeeOptionAmount(option);

    const labelBottomRight = feeRateToString(feeOption, wallet);

    const duplicateIndex = options.findIndex((o, otherIndex) => otherIndex > i && getFeeOptionAmount(o) === feeOption);

    const disabled = duplicateIndex > i;

    const labelBottomLeft = option.estimatedTimeBlocks ? getTimeEstimate(wallet.type, option.estimatedTimeBlocks) : undefined;

    return {
      id: option.kind,
      labelLeft,
      labelRight,
      labelBottomLeft,
      labelBottomRight,
      disabled,
    };
  });
};
