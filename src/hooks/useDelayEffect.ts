import type { DependencyList, EffectCallback } from 'react';

import { useEffect, useRef } from 'react';

export const useDelayEffect = (effect: EffectCallback, dependencies: DependencyList, delay = 1000): void => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(
    function delayedEffect() {
      timeoutRef.current = setTimeout(effect, delay);

      return () => {
        clearTimeout(timeoutRef.current);
      };
    },
    [effect, dependencies, delay],
  );
};
