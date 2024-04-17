import { SuperBigNumber } from '@/utils/SuperBigNumber';
import { unitConverter } from '@/utils/unitConverter';

export async function validateAmount(amount: string, decimals: number, currentNativeCoinBalance: string): Promise<SuperBigNumber> {
  const amountSmallestUnits = unitConverter.tokenUnit2SmallestUnit(amount, decimals);
  if (amountSmallestUnits.isNaN()) {
    throw Error('Validate amount: invalid amount');
  }
  if (amountSmallestUnits.isGreaterThan(currentNativeCoinBalance)) {
    throw Error('Validate amount: not enough balance');
  }
  return amountSmallestUnits;
}
