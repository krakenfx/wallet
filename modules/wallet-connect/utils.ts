
import type { SimulationResult } from '@/api/types';
import type { Network } from '@/onChain/wallets/base';
import { EVMHarmonyTransport, EVMNetwork } from '@/onChain/wallets/evm';
import type { WalletType} from '@/onChain/wallets/registry';
import { networkIdToNetworkName } from '@/onChain/wallets/registry';
import { SolanaHarmonyTransport, SolanaNetwork } from '@/onChain/wallets/solana';
import type { Verification } from '@/screens/ConnectApp/types';

import type { Warning } from '@/types';

import { WALLET_CONNECT_SUPPORTED_NETWORK_IDS } from './consts';
import { SHIM_replaceWrongSolanaMainnetID } from './solanaShim';

import type { WALLET_CONNECT_SUPPORTED_NETWORKS} from './consts';
import type { SessionTypes, Verify } from '@walletconnect/types';

import loc from '/loc';


export function hexToAscii(message?: string): string {
  return message ? (message.startsWith('0x') ? Buffer.from(message.replace('0x', ''), 'hex').toString('ascii') : message) : '';
}

export function hexToDecimal(hex?: string): string {
  return hex ? (hex.startsWith('0x') ? parseInt(hex, 16).toString() : hex) : '';
}


export function isWalletConnectURI(uri: string) {
  return uri.startsWith('wc:');
}


export function isWalletConnectURIV1(uri: string) {
  return isWalletConnectURI(uri) && (uri.endsWith('@1') || uri.includes('@1?'));
}


export function isWalletConnectURIV2(uri: string) {
  return isWalletConnectURI(uri) && (uri.endsWith('@2') || uri.includes('@2?'));
}

export function isSupportedNetwork(network: Network): network is (typeof WALLET_CONNECT_SUPPORTED_NETWORKS)[number] {
  return WALLET_CONNECT_SUPPORTED_NETWORK_IDS.some(supportedNetworkID => network.caipId === supportedNetworkID);
}

export function isEVMNetwork(network: Network): network is EVMNetwork {
  return network instanceof EVMNetwork;
}

export function isEVMHarmonyTransport(transport: unknown): transport is EVMHarmonyTransport {
  return transport instanceof EVMHarmonyTransport;
}

export function isSolanaNetwork(network: Network): network is SolanaNetwork {
  return network instanceof SolanaNetwork;
}

export function isSolanaTransport(transport: unknown): transport is SolanaHarmonyTransport {
  return transport instanceof SolanaHarmonyTransport;
}

export function getNetworkName(networkID: string): WalletType | '' {
  const networkID_ = SHIM_replaceWrongSolanaMainnetID(networkID);

  return networkIdToNetworkName[networkID_] ?? '';
}

export function getNetworkNameFromWalletString(walletString: string): WalletType | '' {
  const [chain, id] = splitWalletString(walletString);
  return getNetworkName(chain + ':' + id);
}



export function splitWalletString(walletString: string): [string, string, string] {
  const [chain, id, address] = walletString.split(':');
  const chainID = SHIM_replaceWrongSolanaMainnetID(`${chain}:${id}`);
  const [chain_, id_] = chainID.split(':');

  return [chain_, id_, address];
}



export function isCAIP2(s: string): boolean {
  return s.includes(':');
}

export function loopOverAllSessionNamespaceAccounts(session: SessionTypes.Struct | undefined, callback: (walletString: string, i: number) => void) {
  Object.entries(session?.namespaces ?? {}).forEach(([key, { accounts }]) => {
    const isKeyCAIP2 = isCAIP2(key);
    (isKeyCAIP2 ? [key] : accounts || []).forEach(callback);
  });
}

export function getVerificationFromWalletConnectVerify(verified: Verify.Context['verified']): Verification {
  const isDomainMatch = verified.validation === 'VALID';

  if (verified.validation === 'INVALID' ) {
    return {
      isDomainMatch,
      warning: {
        severity: 'critical',
        heading: loc.onChainSecurity.domainMismatchWarning,
        message: loc.onChainSecurity.domainMismatchMessage,
      },
    };
  }

  return {
    isDomainMatch,
  };
}

export function getWarningFromSimulation(
  preventativeAction?: SimulationResult['preventativeAction'],
  warnings?: SimulationResult['warnings'],
): Warning | undefined {
  const isCriticalWarning = preventativeAction === 'BLOCK';
  const isMediumWarning = preventativeAction === 'WARN';
  const isWarning = isCriticalWarning || isMediumWarning;

  if (isWarning) {
    return {
      severity: isCriticalWarning ? 'critical' : 'medium',
      heading: isCriticalWarning ? loc.onChainSecurity.criticalWarning : loc.onChainSecurity.warning,
      message: warnings?.map(({ message }) => message).join('\n') ?? loc.onChainSecurity.signTransactionCriticalWarning,
    };
  }
}

export function matchPairingTopic(uri: string) {
  const regex = /wc:(.*?)@/;
  const match = uri.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  return false;
}
