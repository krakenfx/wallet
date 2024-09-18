import { DebounceSettings, debounce } from 'lodash';
import { DependencyList, EffectCallback, useCallback, useEffect } from 'react';

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
