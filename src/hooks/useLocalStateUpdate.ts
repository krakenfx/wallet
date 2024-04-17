import { isEqual } from 'lodash';
import { useEffect, useRef, useState } from 'react';

import { runAfterUISync } from '@/utils/runAfterUISync';

export function useLocalStateUpdate<T>(initialValue: T, setUpstreamValue: (value: T) => void) {
  const [localValue, setLocalValue] = useState<T>(initialValue);
  const updatedManually = useRef<boolean>(false);

  const updateValue = (value: T) => {
    setLocalValue(value);
    updatedManually.current = true;
    runAfterUISync(() => {
      setUpstreamValue(value);
      updatedManually.current = false;
    });
  };

  useEffect(() => {
    if (updatedManually.current) {
      return;
    }
    if (!isEqual(initialValue, localValue)) {
      setLocalValue(initialValue);
    }
  }, [initialValue, localValue]);

  return [localValue, updateValue] as const;
}
