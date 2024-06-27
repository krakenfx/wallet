import BigNumber from 'bignumber.js';

import { Network } from '@/onChain/wallets/base';
import { smallUnit2TokenUnit } from '@/utils/unitConverter';

import { DefinitionList } from '../../../types';
import { hexToDecimal } from '../../../utils';
import { TransactionObject } from '../types';

import loc from '/loc';

function checkForNaN(bigNumber: BigNumber, fallback: string): string {
  return bigNumber.isNaN() ? fallback : bigNumber.toString(10);
}

export function adaptTransactionObjectToDefinitionList(transaction: TransactionObject, network: Network): DefinitionList {
  const amount = hexToDecimal(transaction.value);
  const amountInTokenUnit = smallUnit2TokenUnit(amount, network.nativeTokenDecimals);
  const amount_ = checkForNaN(amountInTokenUnit, amount);

  const result = [
    { title: loc.appSignRequest.amount, description: amount_ },
    { title: loc.appSignRequest.to, description: transaction.to },
    { title: loc.appSignRequest.from, description: transaction.from },
    { title: loc.appSignRequest.nonce, description: hexToDecimal(transaction.nonce) },
  ];

  return result as { title: string; description: string }[];
}
