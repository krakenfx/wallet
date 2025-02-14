import loc from '/loc';

const KRAKEN_ADDRESS = 'kraken';

export const formatTransactionAddress = (transactionAddress: string | undefined | null, type: string, short = false) => {
  if (!transactionAddress) {
    return '';
  }

  const title = type === 'send' ? loc.transactionTile.address.to : loc.transactionTile.address.from;

  return title + formatAddress(transactionAddress, short);
};

export const formatAddress = (address: string, short = false) => {
  if (!address) {
    return '';
  }
  if (address.toLowerCase() === KRAKEN_ADDRESS) {
    return address;
  }

  const part1 = address.substring(0, Math.floor(address.length / 2));
  const part2 = address.substring(Math.floor(address.length / 2));
  const start = part1.substring(0, short ? 4 : 6);
  const end = part2.substring(part2.length - (short ? 4 : 4));

  return start + '…' + end;
};
