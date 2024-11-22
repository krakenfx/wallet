import { SvgIcon } from '@/components/SvgIcon';

import { UrlSecurityLevel } from '../../Browser.types';
import { useBrowserContext } from '../../context/BrowserContext';

export const BrowserLockIcon = () => {
  const { urlSecurityLevel } = useBrowserContext();

  if (urlSecurityLevel === UrlSecurityLevel.SAFE) {
    return <SvgIcon name="lock" color="light50" size={16} />;
  }

  if (urlSecurityLevel === UrlSecurityLevel.UNSAFE) {
    return <SvgIcon name="lock-unlocked" color="red400" size={16} />;
  }

  return null;
};
