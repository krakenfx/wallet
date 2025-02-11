import type { RealmishWallet } from '@/onChain/wallets/base';
import type { EVMHarmonyTransport, EVMNetwork } from '@/onChain/wallets/evm';

import { EvmRpcMethod } from './constants';

import type { PageInfo } from './types';

import loc from '/loc';
import type { DefinitionList, ReactNavigationDispatch } from '/modules/wallet-connect';
import { getWarningFromSimulation } from '/modules/wallet-connect/utils';
import { adaptMessageToEVMMessageSimulationInput, adaptToGenericMessage } from '/modules/wallet-connect/web3Wallet/ethereum';
import { MalformedEIP712TypedData, isEIP712 } from '/modules/wallet-connect/web3Wallet/ethereum/utils/isEIP712';
import { navigateToSignGenericMessagePage } from '/modules/wallet-connect/web3Wallet/navigateToSignGenericMessagePage';

interface Props {
  method: EvmRpcMethod;
  params: unknown[];
  wallet: RealmishWallet;
  dispatch: ReactNavigationDispatch;
  pageInfo: PageInfo | null;
  transport: EVMHarmonyTransport;
  network: EVMNetwork;
  domain: string;
  baseUrl: string;
}

export const openSignMessageApproveModal = async ({ params, transport, network, method, wallet, dispatch, pageInfo, domain, baseUrl }: Props) => {
  const genericMessage = adaptToGenericMessage(method, params);
  const messageSimulationInput = adaptMessageToEVMMessageSimulationInput(method, genericMessage.rawMessage);

  const preparedMessage = await transport.prepareMessage({
    dAppOrigin: baseUrl,
    ...messageSimulationInput,
    network,
    walletData: wallet,
  });

  if (preparedMessage.isError) {
    throw new Error('Transaction simulation failed');
  }

  const warning = getWarningFromSimulation(preparedMessage.preventativeAction, preparedMessage.warnings);

  return navigateToSignGenericMessagePage(
    dispatch,
    wallet.accountIdx as number,
    {
      imageUrl: pageInfo?.iconUrl,
      name: pageInfo?.title ?? domain,
      url: baseUrl,
    },
    genericMessage,
    getDefinitionList(params, method),
    warning,
  );
};

function getDefinitionList(params: unknown[], method: EvmRpcMethod): DefinitionList {
  switch (method) {
    case EvmRpcMethod.eth_signTypedData_v3:
    case EvmRpcMethod.eth_signTypedData_v4: {
      try {
        const eip712Data = JSON.parse(params[1] as string);

        if (!isEIP712(eip712Data)) {
          throw new MalformedEIP712TypedData('Data does not conform to the EIP712 standard');
        }

        return [{ title: loc.appSignRequest.verifyingContract, description: eip712Data.domain.verifyingContract as string }];
      } catch (e) {
        if (e instanceof MalformedEIP712TypedData) {
          throw e;
        }

        throw new Error('Could not parse transaction parameters');
      }
    }
    default:
      return [{ title: loc.appSignRequest.contractAddress, description: params[1] as string }];
  }
}
