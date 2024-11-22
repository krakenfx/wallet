export enum WALLET_CONNECT_ETH_SIGN_TYPES {
  PERSONAL_SIGN = 'personal_sign',
  SIGN = 'eth_sign',
  SIGN_TYPED_DATA = 'eth_signTypedData',
  SIGN_TYPED_DATA_V1 = 'eth_signTypedData_v1',
  SIGN_TYPED_DATA_V3 = 'eth_signTypedData_v3',
  SIGN_TYPED_DATA_V4 = 'eth_signTypedData_v4',

  SEND_TRANSACTION = 'eth_sendTransaction',
  SIGN_TRANSACTION = 'eth_signTransaction',
}

export interface EIP712 {
  primaryType: string;
  domain: Record<string, unknown>;
  message: Record<string, unknown>;
  types: { [key: string]: { type: string; name: string }[] };
}

export type EIP712TypeDefinitions = EIP712['types'][keyof EIP712['types']];

export type TransactionObject = {
  data: string;
  from: string;
  to: string;

  gas: string;

  gasLimit?: string;
  gasPrice?: string;
  value?: string;
  nonce?: string;
};
