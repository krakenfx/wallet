import { TokenListsResult } from '@/api/types';
import { RealmToken } from '@/realm/tokens';

export type RemoteAsset = {
  assetId: string;
  balance: string;
  metadata: {
    label: string;
    symbol: string;
    decimals: number;
    reputation: {
      whitelists: string[];
      blacklists: string[];
    };
  };
  type: 'remoteAsset';
};

export type Item = RealmToken | RemoteAsset;

export type TokenFromTokenLists = TokenListsResult['content']['whitelist'][number];
