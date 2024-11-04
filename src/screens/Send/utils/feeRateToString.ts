import type { RealmishWallet } from '@/onChain/wallets/base';
import { DogecoinNetwork } from '@/onChain/wallets/dogecoin';
import { getImplForWallet } from '@/onChain/wallets/registry';
import { SolanaNetwork } from '@/onChain/wallets/solana';
import { SuperBigNumber } from '@/utils/SuperBigNumber';

export const feeRateToString = (feerate: string, wallet?: RealmishWallet): string | undefined => {
  if (!wallet) {
    return;
  }

  
  const { network } = getImplForWallet(wallet);
  if (network.formatTransactionFee) {
    return network.formatTransactionFee(feerate);
  }

  if (network instanceof SolanaNetwork || network instanceof DogecoinNetwork) {
    return;
  }

  return new SuperBigNumber(feerate).dividedBy(new SuperBigNumber(10).pow(network.nativeTokenDecimals)).toString(10) + ' ' + network.nativeTokenSymbol;
};
