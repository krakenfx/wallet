import { RealmishWallet } from '@/onChain/wallets/base';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { SuperBigNumber } from '@/utils/SuperBigNumber';

export const feeRateToString = (feerate: string, wallet?: RealmishWallet): string => {
  if (!wallet) {
    return '';
  }

  const { network } = getImplForWallet(wallet);
  if (network.formatTransactionFee) {
    return network.formatTransactionFee(feerate);
  }

  return new SuperBigNumber(feerate).dividedBy(new SuperBigNumber(10).pow(network.nativeTokenDecimals)).toString(10) + ' ' + network.nativeTokenSymbol;
};
