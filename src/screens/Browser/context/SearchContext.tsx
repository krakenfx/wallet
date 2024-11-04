import type { PropsWithChildren } from 'react';

import React, { useContext, useState } from 'react';

import { Platform } from 'react-native';

import { createGoogleSearchUrl } from '../utils/createGoogleSearchUrl';
import { getHttpsUrlOrGoogleSearchUrl } from '../utils/getHttpsUrlOrGoogleSearchUrl';

import { useBrowserContext } from './BrowserContext';

interface SearchContextValue {
  showSearchBar: boolean;
  searchValue: string;
  changeSearchValue: (newValue: string) => void;
  clearSearch: () => void;
  handleSearch: () => void;
  searchWithGoogle: () => void;
  handleShowSearch: () => void;
  handleHideSearch: () => void;
}

const SearchContext = React.createContext<SearchContextValue | undefined>(undefined);

export const SearchContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { cleanUrl, setUrl, setShouldDisplayWebView } = useBrowserContext();

  const [showSearchBar, setShowSearchbar] = useState(!cleanUrl);
  const [searchValue, setSearchValue] = useState('');

  const changeSearchValue = (newValue: string) => {
    setSearchValue(newValue);
  };

  const handleShowSearch = () => setShowSearchbar(true);

  const handleHideSearch = () => setShowSearchbar(false);

  const clearSearch = () => setSearchValue('');

  const handleSearch = () => {
    if (!searchValue) {
      return;
    }

    const trimmedInput = searchValue.trim();
    if (trimmedInput === '') {
      return;
    }

    
    if (Platform.OS === 'android') {
      setShouldDisplayWebView(false);
    }

    const newUrl = getHttpsUrlOrGoogleSearchUrl(trimmedInput);
    setUrl(newUrl);

    handleHideSearch();
  };

  const searchWithGoogle = () => {
    const trimmedInput = searchValue.trim();
    if (trimmedInput === '') {
      return;
    }

    const googleSearchUrl = createGoogleSearchUrl(trimmedInput);
    setUrl(googleSearchUrl);

    handleHideSearch();
  };

  return (
    <SearchContext.Provider
      value={{
        showSearchBar,
        searchValue,
        handleSearch,
        searchWithGoogle,
        changeSearchValue,
        clearSearch,
        handleShowSearch,
        handleHideSearch,
      }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = (): SearchContextValue => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error('SearchContext not initialized');
  }

  return context;
};
