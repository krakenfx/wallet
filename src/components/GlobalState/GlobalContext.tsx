import noop from 'lodash/noop';
import React, { PropsWithChildren, useContext, useState } from 'react';

interface ContextProps {
  isRefreshing: ReturnType<typeof useState<boolean>>;
}

const GlobalContext = React.createContext<ContextProps>({
  isRefreshing: [false, noop],
});

export const GlobalStateProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const isRefreshing = useState<boolean>();

  return <GlobalContext.Provider value={{ isRefreshing }}>{children}</GlobalContext.Provider>;
};

export const useGlobalState = (key: keyof ContextProps) => {
  return useContext(GlobalContext)[key];
};
