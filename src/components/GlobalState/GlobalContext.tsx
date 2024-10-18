import noop from 'lodash/noop';
import React, { Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';

interface ContextProps {
  isRefreshing: ReturnType<typeof useState<boolean>>;
  showNavTabs:[boolean, Dispatch<SetStateAction<boolean>>];
}

const GlobalContext = React.createContext<ContextProps>({
  isRefreshing: [false, noop],
  showNavTabs: [true, noop],
});

export const GlobalStateProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const isRefreshing = useState<boolean>();
  const showNavTabs = useState<boolean>(true);
  
  return <GlobalContext.Provider value={{ isRefreshing, showNavTabs }}>{children}</GlobalContext.Provider>;
};

export const useGlobalState = (key: keyof ContextProps) => {
  return useContext(GlobalContext)[key];
};
