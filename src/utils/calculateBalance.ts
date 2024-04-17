import { unitConverter } from './unitConverter';

export const calculateBalance = ({ price, balance, decimals }: { balance: string; decimals: number; price: number }) => {
  return unitConverter.smallestUnit2Fiat(balance, decimals, price).toNumber();
};
