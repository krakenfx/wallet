import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';




export const SOLANA_MAINNET_ID_WRONG = 'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ';




export const SHIM_replaceWrongSolanaMainnetID = (id: string): [id: string, wasReplaced: boolean] => {
  let result = id;
  let wasReplaced = false;

  if (result === SOLANA_MAINNET_ID_WRONG) {
    result = ChainAgnostic.NETWORK_SOLANA;
    wasReplaced = true;
  }

  return [result, wasReplaced];
};
