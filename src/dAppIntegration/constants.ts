import { getHexValue } from '@/dAppIntegration/utils.ts';
import { arbitrumNetwork, baseNetwork, blastNetwork, ethereumNetwork } from '@/onChain/wallets/evmNetworks.ts';

const baseChainId = getHexValue(baseNetwork.chainId);
const blastChainId = getHexValue(blastNetwork.chainId);
const arbitrumChainId = getHexValue(arbitrumNetwork.chainId);
export const ethereumChainId = getHexValue(ethereumNetwork.chainId);

export const defaultChainIdByDomain: Record<string, string> = {
  'aerodrome.finance': baseChainId,
  'app.thruster.finance': blastChainId,
  'app.gmx.io': arbitrumChainId,
  'blast.io': blastChainId,
};
