import { useCurrentAccountNumber } from '@/realm/accounts/useCurrentAccountNumber';
import type { NavigationProps } from '@/Routes';

export function useAccountNumberFromRoute(route: NavigationProps<'KrakenConnectLanding' | 'KrakenConnectConnected' | 'KrakenConnectDisconnect'>['route']) {
  const { params = {} } = route;
  const { selectedAccountNumber } = params;
  const currentAccountNumber = useCurrentAccountNumber();
  return selectedAccountNumber ?? currentAccountNumber;
}
