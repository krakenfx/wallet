import type { SvgProps } from 'react-native-svg';

import oneInch from './images/1inch.svg';
import aave from './images/aave.svg';
import blacklisted from './images/blacklisted.svg';
import coinGecko from './images/coinGecko.svg';
import coinMarketCap from './images/coinMarketcap.svg';
import compound from './images/compound.svg';
import defiPrime from './images/defiPrime.svg';
import fallback from './images/fallback.svg';
import jupiter from './images/jupiter.svg';
import kraken from './images/kraken.svg';
import popularTokens from './images/polygon.svg';
import superchain from './images/superchain.svg';
import synthetix from './images/synthetix.svg';
import tokenNameService from './images/tokenNameService.svg';
import uniswap from './images/uniswap.svg';
import zerion from './images/zerion.svg';

import type { TokenListNames, TokenListNamesWithFallback } from './types';

import loc from '/loc';

export function isTokenListName(testString: string): testString is TokenListNames {
  return testString in tokenListNameToImageSource;
}

export const tokenListNameToImageSource: Record<TokenListNamesWithFallback, React.FC<SvgProps>> = {
  '1inch': oneInch,
  'Aave Token List': aave,
  'CMC DeFi': coinMarketCap,
  'Popular Tokens': popularTokens,
  'Uniswap Labs Default': uniswap,
  Blacklisted: blacklisted,
  CoinGecko: coinGecko,
  Compound: compound,
  Defiprime: defiPrime,
  fallback: fallback,
  Kraken: kraken,
  'Superchain Token List': superchain,
  Synthetix: synthetix,
  'Token Name Service': tokenNameService,
  Zerion: zerion,
  'Jupiter Solana Token List': jupiter,
};

export const tokenListNameToUILabel: Record<TokenListNames, string> = {
  '1inch': '1INCH',
  'Aave Token List': 'AAVE',
  'CMC DeFi': 'Coinmarketcap DeFi',
  'Popular Tokens': 'Polygon Popular Tokens',
  'Uniswap Labs Default': 'Uniswap Labs',
  Blacklisted: loc.tokenLists.likelySpamTitle,
  CoinGecko: 'CoinGecko',
  Compound: 'Compound',
  Defiprime: 'Defiprime',
  Kraken: 'Kraken Listed Tokens',
  'Superchain Token List': 'Superchain',
  Synthetix: 'Synthetix',
  'Token Name Service': 'TKN',
  Zerion: 'Zerion',
  'Jupiter Solana Token List': 'Jupiter - Strict',
};

export const tokenListNameToURL: Record<TokenListNames, string> = {
  '1inch': 'https://tokenlists.org/token-list?url=tokens.1inch.eth',
  'Aave Token List': 'https://tokenlists.org/token-list?url=tokenlist.aave.eth',
  'CMC DeFi': 'https://tokenlists.org/token-list?url=defi.cmc.eth',
  'Popular Tokens': 'https://github.com/maticnetwork/polygon-token-list',
  'Uniswap Labs Default': 'https://tokenlists.org/token-list?url=https://gateway.ipfs.io/ipns/tokens.uniswap.org',
  Blacklisted: 'https://github.com/dappradar/tokens-blacklist',
  CoinGecko: 'https://tokenlists.org/token-list?url=https://tokens.coingecko.com/uniswap/all.json',
  Compound: 'https://tokenlists.org/token-list?url=https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json',
  Defiprime: 'https://tokenlists.org/token-list?url=https://defiprime.com/defiprime.tokenlist.json',
  Kraken: 'https://support.kraken.com/hc/en-us/articles/360000678446-Cryptocurrencies-available-on-Kraken',
  'Superchain Token List': 'https://tokenlists.org/token-list?url=https://static.optimism.io/optimism.tokenlist.json',
  Synthetix: 'https://tokenlists.org/token-list?url=synths.snx.eth',
  'Token Name Service': 'https://tokenlists.org/token-list?url=list.tkn.eth',
  Zerion: 'https://tokenlists.org/token-list?url=tokenlist.zerion.eth',
  'Jupiter Solana Token List': 'https://github.com/jup-ag/token-list',
};
