import type { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import type { RealmToken } from '@/realm/tokens';

export const getHexValue = (value: number | bigint): string => {
  return '0x' + value.toString(16);
};

export const getEvmChainAgnosticsCoin = (hexNumber: string): ChainAgnostic => {
  return `eip155:${Number(hexNumber)}/slip44:60`;
};

export const getTokenByChainId = (tokens: RealmResults<RealmToken>, currentChainId: string) => {
  const filtered = tokens.filtered('assetId == $0', getEvmChainAgnosticsCoin(currentChainId));
  if (filtered.length > 0) {
    return filtered[0];
  }
  return null;
};
