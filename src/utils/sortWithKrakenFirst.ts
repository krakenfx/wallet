import sortBy from 'lodash/sortBy';

export function sortWithKrakenFirst(list: string[], moveKrakenToFront = true) {
  const sorted = sortBy(list);

  if (moveKrakenToFront) {
    const kxIndex = sorted.findIndex(t => t === 'Kraken');

    if (kxIndex > -1) {
      const kx = sorted.splice(kxIndex, 1);

      return [...kx, ...sorted];
    } else {
      return sorted;
    }
  }

  return sorted;
}
