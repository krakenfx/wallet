import { omit } from 'lodash';

import crypto from 'crypto';

import { EvmRpcMethod, EvmWalletMethod, SolanaRpcMethod } from './constants';

import type { WebViewRequest } from './types';

export const getHexValue = (value: number | bigint): string => {
  return '0x' + value.toString(16);
};

export function getEvmCaipId(evmChainId: number) {
  return `eip155:${evmChainId}`;
}

export function signRequest(secret: string, request: WebViewRequest) {
  const requestWithoutSignature = omit(request, 'signature');
  const requestString = JSON.stringify(requestWithoutSignature);

  return crypto.createHmac('sha256', fromHex(secret)).update(requestString).digest('hex');
}

export function shouldAllowWithoutPermission(method: string) {
  switch (method) {
    case EvmWalletMethod.wallet_requestPermissions:
    case EvmWalletMethod.wallet_switchEthereumChain:
    case EvmRpcMethod.eth_requestAccounts:
    case EvmRpcMethod.eth_chainId:
    case EvmRpcMethod.eth_accounts:
    case SolanaRpcMethod.sol_connect:
      return true;
    default:
      return false;
  }
}

export function fromHex(data: string) {
  return new Uint8Array(Buffer.from(data, 'hex'));
}
