import { EIP712, WALLET_CONNECT_ETH_SIGN_TYPES } from '../types';

export const adaptMessageToEVMMessageSimulationInput = (method: string, message?: string | EIP712) => {
  switch (method) {
    case WALLET_CONNECT_ETH_SIGN_TYPES.SIGN: {
      if (typeof message === 'string') {
        return { unsignedMessage: message };
      }
    }
    case WALLET_CONNECT_ETH_SIGN_TYPES.PERSONAL_SIGN: {
      if (typeof message === 'string') {
        return { unsignedPersonalSignMessage: message };
      }
    }
    case WALLET_CONNECT_ETH_SIGN_TYPES.SIGN_TYPED_DATA:
    case WALLET_CONNECT_ETH_SIGN_TYPES.SIGN_TYPED_DATA_V4: {
      if (message && typeof message !== 'string') {
        castDomainChainIdToString(message);

        return { unsignedTypedData: message };
      }
    }
  }

  return {};
};

function castDomainChainIdToString(message: EIP712) {
  if ('chainId' in message.domain) {
    message.domain.chainId = String(message.domain.chainId);
  }
}
