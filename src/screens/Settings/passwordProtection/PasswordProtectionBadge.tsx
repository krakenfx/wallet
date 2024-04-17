import React from 'react';

import { TickIcon } from '@/screens/Settings/components';

import { usePasswordProtectionEnabled } from './hooks';

export const PasswordProtectionBadge = () => {
  const { encryptionEnabled } = usePasswordProtectionEnabled();

  return <TickIcon enabled={encryptionEnabled} />;
};
