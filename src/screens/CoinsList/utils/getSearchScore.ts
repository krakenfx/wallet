import { isNetworkCoin } from '@/onChain/wallets/registry';

import type { Item } from '../types';

const SEARCH_SCORE_CONFIG = {
  address: {
    match: 200,
    noMatch: 0,
  },
  symbol: {
    exact: 100,
    startsWith: 20,
    endsWith: 10,
    noMatch: 0,
  },
  label: {
    exact: 50,
    startsWith: 10,
    wordStartsWith: 2,
    noMatch: 0,
  },
  nativeCoin: {
    match: 10,
    noMatch: 0,
  },
  tokenList: {
    kraken: 10,
    match: 5,
    noMatch: 0,
  },
};

export const buildSearchScoreToSortingIndex = () => {
  const scoreSets = Object.values(SEARCH_SCORE_CONFIG).map(scores => Object.values(scores));
  const allPossibleScores: number[][] = [];

  scoreSets[0].forEach(score => {
    const sets = [...scoreSets].slice(1);

    let lastCombination = [[score]];
    const runningCombinations: number[][] = [[score]];

    sets.forEach(set => {
      const len = set.length;

      if (len > 1) {
        for (let i = 0; i < len - 1; i++) {
          runningCombinations.push(...[...lastCombination.map(c => [...c])]);
        }
      }

      const span = Math.max(1, runningCombinations.length / len);

      set.forEach((s, i) => {
        const start = span * i;

        for (let ii = start; ii < start + span; ii++) {
          runningCombinations[ii].push(s);
        }
      });

      lastCombination = [...runningCombinations];
    });

    allPossibleScores.push(...runningCombinations);
  });

  const sums = allPossibleScores.map(s => s.reduce((acc, cur) => acc + cur, 0)).sort((a, b) => b - a);

  const indexMap: Record<string, number> = Array.from(new Set(sums)).reduce((acc, curr, i) => {
    return {
      ...acc,
      [curr]: i,
    };
  }, {});

  delete indexMap['0'];

  return indexMap;
};

export const SEARCH_SCORE_TO_SORTING_INDEX: Record<string, number> = buildSearchScoreToSortingIndex();

export const getSearchScore = (searchQuery: string, { metadata: { label, symbol, tokenAddress, reputation }, assetId }: Item) => {
  const symbol_ = symbol.toLowerCase();
  const label_ = label.toLowerCase();
  const address_ = tokenAddress?.toLowerCase();

  const addressScore = address_ && address_ === searchQuery ? SEARCH_SCORE_CONFIG.address.match : SEARCH_SCORE_CONFIG.address.noMatch;

  const symbolScore = symbol_.startsWith(searchQuery)
    ? symbol_ === searchQuery
      ? SEARCH_SCORE_CONFIG.symbol.exact
      : SEARCH_SCORE_CONFIG.symbol.startsWith
    : symbol_.endsWith(searchQuery)
      ? SEARCH_SCORE_CONFIG.symbol.endsWith
      : SEARCH_SCORE_CONFIG.symbol.noMatch;

  const labelScore = label_.startsWith(searchQuery)
    ? label_ === searchQuery
      ? SEARCH_SCORE_CONFIG.label.exact
      : SEARCH_SCORE_CONFIG.label.startsWith
    : label_.includes(` ${searchQuery}`)
      ? SEARCH_SCORE_CONFIG.label.wordStartsWith
      : SEARCH_SCORE_CONFIG.label.noMatch;

  let tokenListScore = SEARCH_SCORE_CONFIG.tokenList.noMatch;

  if (symbolScore + labelScore + addressScore > 0) {
    tokenListScore =
      reputation?.whitelists && reputation?.whitelists.includes('Kraken')
        ? SEARCH_SCORE_CONFIG.tokenList.kraken
        : reputation?.whitelists.length
          ? SEARCH_SCORE_CONFIG.tokenList.match
          : SEARCH_SCORE_CONFIG.tokenList.noMatch;
  }

  const nativeCoinScore =
    symbolScore + labelScore + addressScore > 0 && isNetworkCoin(assetId) ? SEARCH_SCORE_CONFIG.nativeCoin.match : SEARCH_SCORE_CONFIG.nativeCoin.noMatch;

  return addressScore + symbolScore + labelScore + nativeCoinScore + tokenListScore;
};
