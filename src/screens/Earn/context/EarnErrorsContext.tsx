import React, { type Dispatch, type PropsWithChildren, type SetStateAction, useEffect, useState } from 'react';

import { useContext } from 'react';

interface EarnErrorsContextValue {
  heroErrorState: [boolean, Dispatch<SetStateAction<boolean>>];
  carouselErrorState: [boolean, Dispatch<SetStateAction<boolean>>];
  assetsListErrorState: [boolean, Dispatch<SetStateAction<boolean>>];
  shouldRenderErrorPage: boolean;
}

const EarnErrorsContext = React.createContext<EarnErrorsContextValue | undefined>(undefined);

export const EarnErrorsContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const heroErrorState = useState(false);
  const carouselErrorState = useState(false);
  const assetsListErrorState = useState(false);

  const shouldRenderErrorPage = heroErrorState[0] && carouselErrorState[0] && assetsListErrorState[0];

  return (
    <EarnErrorsContext.Provider
      value={{
        heroErrorState,
        carouselErrorState,
        assetsListErrorState,
        shouldRenderErrorPage,
      }}>
      {children}
    </EarnErrorsContext.Provider>
  );
};

export const useEarnErrorsContext = (): EarnErrorsContextValue => {
  const context = useContext(EarnErrorsContext);

  if (!context) {
    throw new Error('EarnErrorsContext not initialized');
  }

  return context;
};

export const useHandleHeroError = (error: Error | null) => {
  const {
    heroErrorState: [_, setHeroError],
  } = useEarnErrorsContext();

  useEffect(() => {
    if (error) {
      setHeroError(true);
    }
  }, [error, setHeroError]);
};

export const useHandleCarouselError = (error: Error | null) => {
  const {
    carouselErrorState: [_, setCarouselError],
  } = useEarnErrorsContext();

  useEffect(() => {
    if (error) {
      setCarouselError(true);
    }
  }, [error, setCarouselError]);
};

export const useHandleAssetsListError = (error: Error | null) => {
  const {
    assetsListErrorState: [_, setAssetsListError],
  } = useEarnErrorsContext();

  useEffect(() => {
    if (error) {
      setAssetsListError(true);
    }
  }, [error, setAssetsListError]);
};
