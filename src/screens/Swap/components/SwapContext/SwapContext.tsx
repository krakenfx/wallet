import type { PropsWithChildren } from 'react';

import React, { useContext, useState } from 'react';

import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import { useTokens } from '@/realm/tokens';

import type { SwapTargetAsset } from '../../types';


type SwapRouteProps = {
  receiveTokenAmount: string;
};

type SwapContext = {
  sourceTokenIdState: [string, React.Dispatch<React.SetStateAction<string>>];
  targetAssetState: ReturnType<typeof useState<SwapTargetAsset>>;
  sourceAmountInputValueState: ReturnType<typeof useState<string>>; 
  sourceAmountState: ReturnType<typeof useState<string>>; 
  amountInputFocusState: ReturnType<typeof useState<boolean>>;
  loadingState: ReturnType<typeof useState<boolean>>;
  swapRouteState: ReturnType<typeof useState<SwapRouteProps>>;
};

const SwapContext = React.createContext<SwapContext | undefined>(undefined);

type ContextProps = {
  defaultTokenId?: string;
};

export const SwapContextProvider: React.FC<PropsWithChildren<ContextProps>> = ({ children, defaultTokenId }) => {
  const ethToken = useTokens().filtered('assetId = $0', ChainAgnostic.COIN_ETHEREUM)[0];

  const sourceTokenIdState = useState<string>(defaultTokenId ?? ethToken.id);
  const targetAssetState = useState<SwapTargetAsset>();
  const sourceAmountState = useState<string>();
  const sourceAmountInputValueState = useState<string>();
  const amountInputFocusState = useState<boolean>();
  const loadingState = useState<boolean>();
  const swapRouteState = useState<SwapRouteProps>();

  return (
    <SwapContext.Provider
      value={{
        sourceTokenIdState,
        sourceAmountState,
        targetAssetState,
        amountInputFocusState,
        sourceAmountInputValueState,
        loadingState,
        swapRouteState,
      }}>
      {children}
    </SwapContext.Provider>
  );
};

export const useSwapContext = (): SwapContext => {
  const context = useContext(SwapContext);

  if (!context) {
    throw new Error('SwapContext not initialized');
  }

  return context;
};
