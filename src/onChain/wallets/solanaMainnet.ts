import { SolanaHarmonyTransport, SolanaNetwork, Solscan } from './solana';
import { ChainAgnostic } from './utils/ChainAgnostic';

import loc from '/loc';

export const solanaMainnet = new SolanaNetwork({
  label: loc.network.solana,
  nativeTokenSymbol: 'SOL',
  nativeTokenCaipId: ChainAgnostic.COIN_SOLANA,
  caipId: ChainAgnostic.NETWORK_SOLANA,
  blockExplorer: new Solscan(),
});

export const solanaRpcNetwork = new SolanaHarmonyTransport();
