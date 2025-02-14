import React, { type PropsWithChildren, useContext, useMemo, useState } from 'react';

import type { KrakenWithdrawMethod } from '@/api/krakenConnect/types';
import type { WalletType } from '@/onChain/wallets/registry';
import { getWalletNetworkByNetworkId } from '@/screens/KrakenConnectSend/utils';

export type KrakenConnectSendContext = {
  withdrawMethodState: ReturnType<typeof useState<KrakenWithdrawMethod>>;
  amountState: [string, React.Dispatch<React.SetStateAction<string>>];
  amountFiatState: [string, React.Dispatch<React.SetStateAction<string>>];
  isInputInFiatCurrencyState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  walletNetworkType: WalletType | undefined;
};

const KrakenConnectSendContext = React.createContext<KrakenConnectSendContext | undefined>(undefined);

export const KrakenConnectSendContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const amountState = useState<string>('');
  const amountFiatState = useState<string>('');
  const withdrawMethodState = useState<KrakenWithdrawMethod>();
  const isInputInFiatCurrencyState = useState<boolean>(false);

  const [withdrawMethod] = withdrawMethodState;

  const walletNetworkType = useMemo(() => withdrawMethod && (getWalletNetworkByNetworkId(withdrawMethod.network_id)?.type as WalletType), [withdrawMethod]);

  return (
    <KrakenConnectSendContext.Provider
      value={{
        amountState,
        amountFiatState,
        withdrawMethodState,
        isInputInFiatCurrencyState,
        walletNetworkType,
      }}>
      {children}
    </KrakenConnectSendContext.Provider>
  );
};

export const useKrakenConnectSendContext = (): KrakenConnectSendContext => {
  const context = useContext(KrakenConnectSendContext);
  if (!context) {
    throw new Error('KrakenConnectSendContext not initialized');
  }

  return context;
};
