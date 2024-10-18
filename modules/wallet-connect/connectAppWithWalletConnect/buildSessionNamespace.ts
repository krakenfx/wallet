import { SessionProposal } from '@/screens/ConnectApp/types';

import { getChainsEip155, getChainsSolana } from './getChainsForSessionNamespace';

import { WALLET_CONNECT_SESSION_NAMESPACE_KEY_EVM, WALLET_CONNECT_SESSION_NAMESPACE_KEY_SOLANA } from '/modules/wallet-connect/consts';
import { SessionNamespace } from '/modules/wallet-connect/types';
import { WALLET_CONNECT_ETH_SIGN_TYPES } from '/modules/wallet-connect/web3Wallet/ethereum/types';
import { WALLET_CONNECT_SOLANA_SIGN_TYPES } from '/modules/wallet-connect/web3Wallet/solana/types';


export function buildSessionNamespace(sessionProposal: SessionProposal, accountsFromMatchedWallets: { eip155: string[]; solana: string[] }): SessionNamespace {
  

  
  const namespacesEIP155 = [
    ...Object.entries(sessionProposal?.params.requiredNamespaces ?? {}),
    ...Object.entries(sessionProposal?.params.optionalNamespaces ?? {}),
  ].filter(([k, _]) => {
    return k.startsWith('eip155');
  });
  const methodsEIP155 = namespacesEIP155.map(([_, v]) => v.methods).flat();
  const uniqueMethodsEIP155 = [...new Set(methodsEIP155)];
  const eventsEIP155 = namespacesEIP155.map(([_, v]) => v.events).flat();
  const uniqueEventsEIP155 = [...new Set(eventsEIP155)];
  const supportedMethodsEIP155: string[] = [
    WALLET_CONNECT_ETH_SIGN_TYPES.SEND_TRANSACTION,
    WALLET_CONNECT_ETH_SIGN_TYPES.SIGN_TRANSACTION,
    WALLET_CONNECT_ETH_SIGN_TYPES.SIGN,
    WALLET_CONNECT_ETH_SIGN_TYPES.PERSONAL_SIGN,
    WALLET_CONNECT_ETH_SIGN_TYPES.SIGN_TYPED_DATA,
    WALLET_CONNECT_ETH_SIGN_TYPES.SIGN_TYPED_DATA_V4,
  ];

  
  const hasProposedEIP155 = namespacesEIP155.length > 0;
  const hasEIP155Wallet = accountsFromMatchedWallets.eip155.length > 0;
  const shouldIncludeEIP155 = hasProposedEIP155 && hasEIP155Wallet;

  
  const namespacesSolana = [
    ...Object.entries(sessionProposal?.params.requiredNamespaces ?? {}),
    ...Object.entries(sessionProposal?.params.optionalNamespaces ?? {}),
  ].filter(([k, _]) => {
    return k.startsWith('solana');
  });
  const methodsSolana = namespacesSolana.map(([_, v]) => v.methods).flat();
  const uniqueMethodsSolana = [...new Set(methodsSolana)];
  const eventsSolana = namespacesSolana.map(([_, v]) => v.events).flat();
  const uniqueEventsSolana = [...new Set(eventsSolana)];
  const supportedMethodsSolana: string[] = [WALLET_CONNECT_SOLANA_SIGN_TYPES.SIGN_MESSAGE, WALLET_CONNECT_SOLANA_SIGN_TYPES.SIGN_TRANSACTION];

  
  const hasProposedSolana = namespacesSolana.length > 0;
  const hasSolanaWallet = accountsFromMatchedWallets.solana.length > 0;
  const shouldIncludeSolana = hasProposedSolana && hasSolanaWallet;
  const sessionNamespace = {
    ...(shouldIncludeEIP155 && {
      [WALLET_CONNECT_SESSION_NAMESPACE_KEY_EVM]: {
        accounts: accountsFromMatchedWallets.eip155,
        methods:
          uniqueMethodsEIP155.length > 0
            ? 
              uniqueMethodsEIP155.filter(m => supportedMethodsEIP155.includes(m))
            : supportedMethodsEIP155,
        events: uniqueEventsEIP155.length > 0 ? uniqueEventsEIP155 : ['chainChanged', 'accountsChanged'],
        chains: getChainsEip155(accountsFromMatchedWallets.eip155),
      },
    }),
    ...(shouldIncludeSolana && {
      [WALLET_CONNECT_SESSION_NAMESPACE_KEY_SOLANA]: {
        accounts: accountsFromMatchedWallets.solana,
        methods:
          uniqueMethodsSolana.length > 0
            ? 
              uniqueMethodsSolana.filter(m => supportedMethodsSolana.includes(m))
            : supportedMethodsSolana,
        events: uniqueEventsSolana.length > 0 ? uniqueEventsSolana : [],
        chains: getChainsSolana(accountsFromMatchedWallets.solana),
      },
    }),
  } as SessionNamespace;

  return sessionNamespace;
}
