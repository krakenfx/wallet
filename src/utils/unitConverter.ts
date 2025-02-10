import { SuperBigNumber } from '@/utils/SuperBigNumber';

import type BigNumber from 'bignumber.js';

export function smallUnit2TokenUnit(amountOfSMallUnits: BigNumber.Value, decimals: number) {
  return new SuperBigNumber(amountOfSMallUnits).dividedBy(Math.pow(10, decimals));
}

export function tokenUnit2SmallestUnit(amountOfTokenUnits: BigNumber.Value, decimals: number) {
  return new SuperBigNumber(amountOfTokenUnits).multipliedBy(Math.pow(10, decimals));
}

export function tokenUnit2Fiat(amount: BigNumber.Value, price: BigNumber.Value) {
  return new SuperBigNumber(amount).multipliedBy(price);
}

export function smallestUnit2Fiat(amount: BigNumber.Value, decimals: number, price: BigNumber.Value) {
  return smallUnit2TokenUnit(amount, decimals).multipliedBy(price);
}

export function fiatToTokenUnit(amount: BigNumber.Value, price: BigNumber.Value) {
  return new SuperBigNumber(amount).dividedBy(price);
}
export function fiatToSmallestUnit(amount: BigNumber.Value, decimals: number, price: BigNumber.Value) {
  return tokenUnit2SmallestUnit(fiatToTokenUnit(amount, price), decimals);
}

export const unitConverter = {
  smallUnit2TokenUnit,
  tokenUnit2SmallestUnit,
  tokenUnit2Fiat,
  smallestUnit2Fiat,
  fiatToTokenUnit,
  fiatToSmallestUnit,
};
