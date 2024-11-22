import noop from 'lodash/noop';
import React, { type PropsWithChildren } from 'react';

import { useContext } from 'react';

import type { ExpandableSheetMethods } from './types';

const ExpandableSheetContext = React.createContext<ExpandableSheetMethods>({
  close: noop,
  collapse: noop,
  expand: noop,
});

export const ExpandableSheetContextProvider: React.FC<PropsWithChildren<ExpandableSheetMethods>> = ({ close, collapse, expand, children }) => {
  return <ExpandableSheetContext.Provider value={{ close, collapse, expand }}>{children}</ExpandableSheetContext.Provider>;
};

export const useExpandableSheetContext = () => {
  const context = useContext(ExpandableSheetContext);

  if (context === undefined) {
    throw new Error('useExpandableSheetContext must be used within a ExpandableSheetContextProvider');
  }
  return context;
};
