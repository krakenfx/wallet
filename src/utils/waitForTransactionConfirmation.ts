import { EVMHarmonyTransport, EVMNetwork } from '@/onChain/wallets/evm';
import { getImplForWallet } from '@/onChain/wallets/registry';
import type { RealmWallet } from '@/realm/wallets';
import { timePerBlockInSecondsMap } from '@/screens/Send/utils/getTimeEstimate';

export const waitForTransactionConfirmation = async (wallet: RealmWallet, txId: string, blockInterval = 1): Promise<boolean> => {
  const { network, transport } = getImplForWallet(wallet);

  if (!(transport instanceof EVMHarmonyTransport) || !(network instanceof EVMNetwork)) {
    throw new Error(`Network ${wallet.type} is not supported`);
  }

  const blockTimeInSec = timePerBlockInSecondsMap[wallet.type] ?? 10;
  const timeIntervalInMs = blockTimeInSec * blockInterval * 1000;

  return new Promise((resolve, reject) => {
    const pollStatus = async () => {
      try {
        const status = await transport.getTransactionStatus(network, txId);
        if (status === 'confirmed') {
          resolve(true);
        } else if (status === 'failed') {
          reject(new Error('Transaction failed'));
        } else {
          setTimeout(pollStatus, timeIntervalInMs);
        }
      } catch (error) {
        reject(error);
      }
    };
    pollStatus();
  });
};
