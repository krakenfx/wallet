import { FeeOption } from '@/api/types';

export const getFeeOptionAmount = (option: FeeOption): string => {
  if ('is1559' in option) {
    if (option.is1559) {
      return option.maxFeePerGas;
    } else {
      return option.fee;
    }
  } else if ('computeUnitPriceMicroLamports' in option) {
    return option.computeUnitPriceMicroLamports.toString();
  } else {
    return option.amount;
  }
};
