import { TokenListsResult } from '@/api/types';
import { RealmToken } from '@/realm/tokens';
import { RemoteAsset } from '@/types';

export type Item = RealmToken | RemoteAsset;

export type TokenFromTokenLists = TokenListsResult['content']['whitelist'][number];
