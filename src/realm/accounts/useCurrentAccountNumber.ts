import { useMemo } from 'react';

import { RealmSettingsKey } from '../settings';
import { useSettingsByKey } from '../settings/useSettingsByKey';

import { DEFAULT_ACCOUNT_NUMBER } from './utils';

export const useCurrentAccountNumberOrUndefined = (): number | undefined => {
  const accountNumber = useSettingsByKey(RealmSettingsKey.accountNumber);
  return useMemo(() => accountNumber ?? undefined, [accountNumber]);
};

export const useCurrentAccountNumber = (): number => {
  const accountNumber = useCurrentAccountNumberOrUndefined();
  return useMemo(() => (accountNumber !== undefined ? accountNumber : DEFAULT_ACCOUNT_NUMBER), [accountNumber]);
};
