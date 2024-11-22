import { useIsAppLockUsed } from '../appLock/hooks';
import { TickIcon } from '../components';

export const AppLockBadge = () => {
  const { isAppLockUsed } = useIsAppLockUsed();

  return <TickIcon enabled={isAppLockUsed} />;
};
