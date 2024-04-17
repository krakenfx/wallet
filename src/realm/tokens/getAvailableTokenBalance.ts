import BigNumber from 'bignumber.js';

import { RealmPendingTransaction } from '../transactions';

export const getAvailableTokenBalance = (token: {
  balance: string;
  metadata: { decimals: number };
  pendingTransactions?: Realm.List<RealmPendingTransaction>;
}) => {
  const { pendingTransactions } = token;
  if (pendingTransactions && pendingTransactions.length > 0) {
    const totalOutgoingBalance = pendingTransactions
      .filter(tx => tx.kind === 'send' && !tx.confirmed && tx.additionalStatus !== 'invalidated')
      .reduce((acc, curr) => {
        const balanceValue = curr.amount ? BigNumber(curr.amount) : BigNumber(0);

        if (curr.type === 'coin') {
          const feeValue = curr.fee ? BigNumber(curr.fee) : BigNumber(0);
          return BigNumber.sum(acc, balanceValue, feeValue);
        } else {
          return BigNumber.sum(acc, balanceValue);
        }
      }, BigNumber(0));
    const totalBalance = BigNumber.sum(token.balance, -totalOutgoingBalance);

    return totalBalance.toFixed();
  } else {
    return token.balance;
  }
};
