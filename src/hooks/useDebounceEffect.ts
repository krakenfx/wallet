import type { DependencyList, EffectCallback } from 'react';

import { debounce } from 'lodash';
import { useCallback, useEffect } from 'react';

import type { DebounceSettings } from 'lodash';

export const useDebounceEffect = (effect: EffectCallback, dependencies: DependencyList, delay?: number, options?: DebounceSettings): void => {
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedEffect = useCallback(debounce(effect, delay, options), [effect, delay]);

  useEffect(() => {
    debouncedEffect();

    return () => {
      debouncedEffect.cancel();
    };
  }, [debouncedEffect, dependencies]);
};
