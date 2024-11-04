import { isObject } from 'lodash';

import { sanitizeEIP712 } from './sanitizeEIP712';

import type { DefinitionList } from '../../../types';
import type { EIP712 } from '../types';

export function adaptEIP712ToDefinitionList(eip712: EIP712): DefinitionList {
  const data = sanitizeEIP712(eip712);
  const domainEntries = Object.entries(data.domain);
  const messageEntries = Object.entries(data.message);
  const definitionList: DefinitionList = [];

  [...domainEntries, ...messageEntries].forEach(([domainOrMessageKey, domainOrMessageValue]) => {
    if (isObject(domainOrMessageValue)) {
      definitionList.push({ title: domainOrMessageKey.trim(), description: JSON.stringify(domainOrMessageValue, null, 4).trim() });
    } else {
      definitionList.push({ title: domainOrMessageKey.trim(), description: String(domainOrMessageValue).trim() });
    }
  });

  return definitionList;
}
