import { useRef } from 'react';

export const useRefreshKey = (key?: string, onInvalidated?: () => void) => {
  const lastKey = useRef(key);
  
  if (key !== lastKey.current) {
    lastKey.current = key;
    if (onInvalidated) {
      onInvalidated();
    }
  }
};
