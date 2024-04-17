import { GenericMessage } from '../../../types';
import { hexToAscii } from '../../../utils';
import { EIP712, WALLET_CONNECT_ETH_SIGN_TYPES } from '../types';

import { adaptEIP712ToDefinitionList } from './adaptEIP712ToDefinitionList';
import { isEIP712 } from './isEIP712';

import loc from '/loc';

export function adaptToGenericMessage(signMethod: string, requestParams: any): GenericMessage {
  let address = '';
  let heading;
  let _message: string;
  let message:
    | string
    | {
        title: string;
        description: string;
      }[] = '';
  let rawMessage: string | EIP712 = '';

  switch (signMethod) {
    case WALLET_CONNECT_ETH_SIGN_TYPES.PERSONAL_SIGN: {
      [_message, address] = requestParams;
      message = _message;
      rawMessage = _message;
      break;
    }
    case WALLET_CONNECT_ETH_SIGN_TYPES.SIGN: {
      [address, _message] = requestParams;
      message = _message;
      rawMessage = _message;
      break;
    }

    case WALLET_CONNECT_ETH_SIGN_TYPES.SIGN_TYPED_DATA:
    case WALLET_CONNECT_ETH_SIGN_TYPES.SIGN_TYPED_DATA_V4: {
      const message_ = requestParams[1];

      if (typeof message_ === 'string') {
        try {
          const parsedMessage = JSON.parse(message_);

          if (isEIP712(parsedMessage)) {
            heading = parsedMessage.primaryType;
            message = adaptEIP712ToDefinitionList(parsedMessage);
            rawMessage = parsedMessage;
          } else {
            message = message_;
            rawMessage = message_;
          }
        } catch (e) {
          message = message_;
          rawMessage = message_;
        }
      } else if (isEIP712(message_)) {
        heading = message_.primaryType;
        message = adaptEIP712ToDefinitionList(message_);
        rawMessage = message_;
      }

      [address] = requestParams;
      break;
    }
  }

  return {
    type: 'generic-message',
    address,
    heading,
    message: typeof message === 'string' ? [{ title: loc.appSignRequest.message, description: hexToAscii(message) }] : message,
    rawMessage,
  };
}
