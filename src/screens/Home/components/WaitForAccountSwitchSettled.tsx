import type { PropsWithChildren } from 'react';

import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';

import { useCurrentAccountNumber } from '@/realm/accounts/useCurrentAccountNumber';

export const WaitForAccountSwitchSettled = ({ children }: PropsWithChildren) => {
  const accountNumber = useCurrentAccountNumber();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    setCanRender(false);
    InteractionManager.runAfterInteractions(() => {
      setCanRender(true);
    });
  }, [accountNumber]);

  return canRender ? <>{children}</> : null;
};
