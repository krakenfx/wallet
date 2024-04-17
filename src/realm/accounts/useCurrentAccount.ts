import { useAccountById } from './useAccountById';
import { useCurrentAccountNumber } from './useCurrentAccountNumber';

export const useCurrentAccount = () => {
  const currentAccountNumber = useCurrentAccountNumber();
  return useAccountById(currentAccountNumber);
};
