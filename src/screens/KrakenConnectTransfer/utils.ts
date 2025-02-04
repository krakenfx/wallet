import BigNumber from 'bignumber.js';

import type { AssetsDict, KrakenAssetRaw } from '@/reactQuery/hooks/krakenConnect/types';

export const krakenToAssetSymbol: Record<string, string> = {
  XBT: 'BTC',
  XXBT: 'BTC',
  XETH: 'ETH',
  XLTC: 'LTC',
  XXDG: 'DOGE',
  XXRP: 'XRP',
  BCHEUR: 'BCH',
  XADA: 'ADA',
  XDOGE: 'DOGE',
  XXLM: 'XLM',
  XSOL: 'SOL',
  XTRX: 'TRX',
};

export const getBaseAssetSymbol = (value: string): string => {
  const dotIndex = value.indexOf('.');
  return dotIndex !== -1 ? value.substring(0, value.indexOf('.')) : value;
};

export const getMainAssetSymbol = (value: string): string => {
  const baseSymbol = getBaseAssetSymbol(value);
  return krakenToAssetSymbol[baseSymbol] || baseSymbol;
};

export const isBalanceFromAssetOnHold = (assetName: string): boolean => {
  const dotIndex = assetName.indexOf('.');
  if (dotIndex === -1) {
    return false;
  }

  return dotIndex === -1 ? false : assetName.split('.')[1].toUpperCase() !== 'F';
};

export const mapAllAssetsToMainAssets = (assetsDict: AssetsDict) => {
  return Object.entries(assetsDict).reduce<KrakenAssetRaw[]>((resultArray, [symbol, value]) => {
    const mainAssetSymbol = getMainAssetSymbol(symbol);
    const existingAsset = resultArray.find(asset => asset.symbol.toLowerCase() === mainAssetSymbol.toLowerCase());

    const balance: BigNumber = new BigNumber(value.balance);
    let hold_trade: BigNumber = new BigNumber(value.hold_trade);
    if (isBalanceFromAssetOnHold(symbol)) {
      hold_trade = new BigNumber(value.balance);
    }

    if (existingAsset) {
      existingAsset.balance = balance.plus(existingAsset.balance).toString(10);
      existingAsset.hold_trade = hold_trade.plus(existingAsset.hold_trade).toString(10);
    } else {
      resultArray.push({
        krakenAssetSymbol: getBaseAssetSymbol(symbol),
        symbol: mainAssetSymbol,
        balance: balance.toString(10),
        hold_trade: hold_trade.toString(10),
      });
    }
    return resultArray;
  }, []);
};
