import { EIP712, WALLET_CONNECT_ETH_SIGN_TYPES } from '../types';

export const adaptMessageToEVMMessageSimulationInput = (method: string, message?: string | EIP712) => {
  if (!message) {
    return {};
  }

  if (typeof message !== 'string') {
    castDomainChainIdToString(message);
    return { unsignedTypedData: message };
  }

  switch (method) {
    case WALLET_CONNECT_ETH_SIGN_TYPES.SIGN: {
      return { unsignedMessage: message };
    }
    case WALLET_CONNECT_ETH_SIGN_TYPES.PERSONAL_SIGN: {
      return { unsignedPersonalSignMessage: message };
    }
    default:
      return {};
  }
};

function castDomainChainIdToString(message: EIP712) {
  if ('chainId' in message.domain) {
    message.domain.chainId = String(message.domain.chainId);
  }
}
