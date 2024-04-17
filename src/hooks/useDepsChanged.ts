import { DependencyList, useRef } from 'react';

export const useDepsChanged = (deps?: DependencyList): boolean => {
  const lastDeps = useRef<DependencyList>();

  try {
    if (!lastDeps.current || !deps || deps.length !== lastDeps.current.length) {
      return true;
    }

    if (lastDeps.current === deps) {
      return false;
    }

    for (let index = 0; index < deps.length; ++index) {
      if (deps[index] !== lastDeps.current[index]) {
        return true;
      }
    }

    return false;
  } finally {
    lastDeps.current = deps || [];
  }
};
