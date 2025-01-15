import BigNumber from 'bignumber.js';

import type { WalletState } from '@/onChain/wallets/bitcoin';
import { Networks, Transports } from '@/onChain/wallets/registry';
import { getWalletStorage } from '@/onChain/wallets/walletState';

import type { RealmWallet } from '@/realm/wallets';
import { type SecuredKeychainContext } from '@/secureStore/SecuredKeychainProvider';

import { getWalletDataByAccount } from './getWalletDataByAccount';

import type Realm from 'realm';

import { handleError } from '/helpers/errorHandler';

export async function fetchHasBalanceBtcForAccountZero(getSeed: SecuredKeychainContext['getSeed'], realm: Realm, hdSegwitBech32Wallet0: RealmWallet) {
  const seed = await getSeed('createWallet', true);
  if (!seed) {
    handleError('Onboarding import sub-wallets: missing seed', 'ERROR_CONTEXT_PLACEHOLDER');
    return {};
  }

  const walletData = getWalletDataByAccount(seed, Networks.HDsegwitBech32, 0);
  const walletStorage = await getWalletStorage<WalletState>(realm, hdSegwitBech32Wallet0, false);
  const btcBalance = await Transports.HDsegwitBech32.fetchBalance(Networks.HDsegwitBech32, walletData, walletStorage);
  const btcValue = BigNumber(btcBalance[0]?.balance.value ?? '0');
  const hasBalance = btcValue.gt(0);

  return { 0: hasBalance };
}
