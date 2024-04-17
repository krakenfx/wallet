import { getDefaultWordlist, wordlists } from 'bip39';

export const getSeedWordIndex = () => {
  const words = wordlists[getDefaultWordlist()];

  const index: Record<string, string[]> = {};

  const insertToIndex = (prefix: string, word: string) => {
    if (!index[prefix]) {
      index[prefix] = [];
    }

    index[prefix].push(word);
  };

  for (const word of words) {
    for (let i = 1; i < word.length + 1; i++) {
      insertToIndex(word.slice(0, i), word);
    }
  }

  return index;
};
