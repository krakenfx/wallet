import { Transaction } from '@/api/types';
import { BTCTransaction } from '@/onChain/wallets/bitcoin';

export const getAddressesFromParsedTransaction = (
  parsedTransaction: Transaction | BTCTransaction | undefined,
): { sender: string; recipient: string; target: string } => {
  const result = { sender: '', recipient: '', target: '' };

  if (parsedTransaction && 'effects' in parsedTransaction && parsedTransaction.effects.length > 0) {
    const effect = parsedTransaction.effects[0];

    if ('sender' in effect) {
      result.sender = effect.sender;
    }

    if ('recipient' in effect) {
      result.recipient = effect.recipient;
    }

    if (effect.type === 'swap') {
      if ('receive' in effect && effect.receive.sender) {
        result.sender = effect.receive.sender;
      }

      if ('spent' in effect && effect.spent.recipient) {
        result.recipient = effect.spent.recipient;
      }
    }
  }

  if (parsedTransaction && 'metadata' in parsedTransaction && 'target' in parsedTransaction.metadata!) {
    result.target = parsedTransaction.metadata.target ?? '';
  }

  return result;
};
