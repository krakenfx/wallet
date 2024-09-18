import noop from 'lodash/noop';
import React, { PropsWithChildren, useContext } from 'react';

import { ExpandableSheetMethods } from './types';

const ExpandableSheetContext = React.createContext<ExpandableSheetMethods>({
  close: noop,
  collapse: noop,
  expand: noop,
});

export const ExpandableSheetContextProvider: React.FC<PropsWithChildren<ExpandableSheetMethods>> = ({ close, collapse, expand, children }) => {
  return <ExpandableSheetContext.Provider value={{ close, collapse, expand }}>{children}</ExpandableSheetContext.Provider>;
};

export const useExpandableSheetContext = () => {
  return useContext(ExpandableSheetContext);
};
