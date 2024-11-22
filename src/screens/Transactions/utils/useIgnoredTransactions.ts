import { throttle } from 'lodash';
import { useCallback, useRef, useState } from 'react';

export const useIgnoredTransactions = () => {
  const hiddenTransactions = useRef<Set<string>>(new Set());
  const [ignoredIds, setIgnoredIds] = useState<string[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updatedIgnoredIds = useCallback(
    throttle(
      () => {
        setIgnoredIds(Array.from(hiddenTransactions.current));
      },
      250,
      { leading: false },
    ),
    [],
  );

  const onTransactionHide = useCallback(
    (txId: string) => {
      hiddenTransactions.current.add(txId);
      updatedIgnoredIds();
    },
    [updatedIgnoredIds],
  );

  const resetIgnoredIds = useCallback(() => {
    hiddenTransactions.current.clear();
    setIgnoredIds([]);
  }, []);

  return { ignoredIds, onTransactionHide, resetIgnoredIds };
};
