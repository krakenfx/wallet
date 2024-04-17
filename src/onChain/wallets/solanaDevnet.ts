import { SolanaHarmonyTransport, SolanaNetwork, Solscan } from './solana';
import { ChainAgnostic } from './utils/ChainAgnostic';

import loc from '/loc';

export const solanaDevnet = new SolanaNetwork({
  nativeTokenSymbol: 'SOL',
  nativeTokenCaipId: ChainAgnostic.COIN_SOLANA_DEVNET,
  caipId: ChainAgnostic.NETWORK_SOLANA_DEVNET,
  label: loc.network.solana_devnet,
  blockExplorer: new Solscan('devnet'),
  isTestnet: true,
});

export const solanaDevnetTransport = new SolanaHarmonyTransport();
