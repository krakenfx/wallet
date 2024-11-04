import type { TokenListsResult } from '@/api/types';
import type { RealmToken } from '@/realm/tokens';
import type { RemoteAsset } from '@/types';

export type Item = RealmToken | RemoteAsset;

export type TokenFromTokenLists = TokenListsResult['content']['whitelist'][number];
