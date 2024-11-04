import type { Item } from '../types';



const SEARCH_SCORE_CONFIG = {
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
  tokenList: {
    kraken: 10, 
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

export const getSearchScore = (searchQuery: string, { metadata: { label, symbol, reputation } }: Item) => {
  const symbol_ = symbol.toLowerCase();
  const label_ = label.toLowerCase();

  const symbolScore = symbol_.startsWith(searchQuery)
    ? symbol_ === searchQuery
      ? SEARCH_SCORE_CONFIG.symbol.exact
      : SEARCH_SCORE_CONFIG.symbol.startsWith
    : symbol_.endsWith(searchQuery)
      ? SEARCH_SCORE_CONFIG.symbol.endsWith
      : 0;

  const labelScore = label_.startsWith(searchQuery)
    ? label_ === searchQuery
      ? SEARCH_SCORE_CONFIG.label.exact
      : SEARCH_SCORE_CONFIG.label.startsWith
    : label_.includes(` ${searchQuery}`)
      ? SEARCH_SCORE_CONFIG.label.wordStartsWith
      : 0;

  
  
  const tokenListScore =
    symbolScore + labelScore > 0 && reputation?.whitelists && reputation?.whitelists.includes('Kraken') ? SEARCH_SCORE_CONFIG.tokenList.kraken : 0;

  return symbolScore + labelScore + tokenListScore;
};
