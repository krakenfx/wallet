import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';

export const SOLANA_MAINNET_ID_WRONG = 'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ';

export const SHIM_replaceWrongSolanaMainnetID = (id: string) => {
  return id === SOLANA_MAINNET_ID_WRONG ? ChainAgnostic.NETWORK_SOLANA : id;
};
