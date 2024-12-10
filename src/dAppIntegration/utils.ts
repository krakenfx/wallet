import { omit } from 'lodash';

import crypto from 'crypto';

import { type CaveatItem, type CaveatsObject, RpcMethod, WalletMethod, type WebViewRequest } from '@/dAppIntegration/types.ts';
import type { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import type { RealmToken } from '@/realm/tokens';

export const getHexValue = (value: number | bigint): string => {
  return '0x' + value.toString(16);
};

const getEvmChainAgnosticsCoinPrefix = (hexNumber: string): ChainAgnostic => {
  return `eip155:${Number(hexNumber)}/slip44`;
};

export const getTokenByChainId = (tokens: RealmResults<RealmToken>, currentChainId: string) => {
  const filtered = tokens.filtered('assetId BEGINSWITH $0', getEvmChainAgnosticsCoinPrefix(currentChainId));
  if (filtered.length > 0) {
    return filtered[0];
  }
  return null;
};

export function transformCaveats(caveatsObject: CaveatsObject): CaveatItem[] {
  return Object.entries(caveatsObject).map(([key, value]) => ({
    type: key,
    value,
  }));
}

export function requiresUserInteraction(method: RpcMethod | WalletMethod) {
  switch (method) {
    case WalletMethod.wallet_requestPermissions:
    case RpcMethod.eth_requestAccounts:
      return true;

    default:
      return false;
  }
}

export function signRequest(secret: string, request: WebViewRequest) {
  const requestWithoutSignature = omit(request, 'signature');
  const requestString = JSON.stringify(requestWithoutSignature);

  return crypto.createHmac('sha256', secret).update(requestString).digest('hex');
}
