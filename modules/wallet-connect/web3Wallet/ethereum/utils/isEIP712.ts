import { isObject } from 'lodash';

import { EIP712 } from '../types';

export function isEIP712(message: unknown): message is EIP712 {
  return isObject(message) && 'primaryType' in message && 'domain' in message && 'message' in message;
}
