import { isObject } from 'lodash';

import { DefinitionList } from '../../../types';
import { EIP712 } from '../types';

import { handleError } from '/helpers/errorHandler';

export function adaptEIP712ToDefinitionList(data: EIP712): DefinitionList {
  const domainEntries = Object.entries(data.domain);
  const messageEntries = Object.entries(data.message);
  const definitionList: DefinitionList = [];

  [...domainEntries, ...messageEntries].forEach(([domainOrMessageKey, domainOrMessageValue]) => {
    if (isObject(domainOrMessageValue)) {
      const domainOrMessageValueEntries = Object.entries(domainOrMessageValue);
      let description = '';
      domainOrMessageValueEntries.forEach(([domainOrMessageValueKey, domainOrMessageValueValue], i) => {
        const isNotLast = i < domainOrMessageValueEntries.length - 1;

        try {
          description += `${domainOrMessageValueKey}: ${
            typeof domainOrMessageValueValue === 'string' ? domainOrMessageValueValue : JSON.stringify(domainOrMessageValueValue)
          }${isNotLast ? '\n' : ''}`;
        } catch (error) {
          handleError(error, 'ERROR_CONTEXT_PLACEHOLDER');
        }
      });

      definitionList.push({ title: domainOrMessageKey, description });
    } else {
      definitionList.push({ title: domainOrMessageKey, description: '' + domainOrMessageValue });
    }
  });

  return definitionList;
}
