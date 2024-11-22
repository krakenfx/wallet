import type { NavigationProps } from '@/Routes';
import { ConnectAppWithBlock } from '@/screens/ConnectApp/components/ConnectAppWithBlock';
import { navigationStyle } from '@/utils/navigationStyle';

import type { UI_STATE, Verification } from './types';

export type ConnectAppParams = {
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  isMalicious: boolean | null;
  verification?: Verification;
  appMetadata?: {
    url: string;
    name: string;
    icon?: string;
  };
  networkIDs?: string[];
  requiredNetworkIDs?: string[];
  uiState: UI_STATE.none | UI_STATE.loading | UI_STATE.complete | undefined;
};

export const ConnectAppScreen = ({ route }: NavigationProps<'ConnectApp'>) => {
  return <ConnectAppWithBlock {...route.params} />;
};

ConnectAppScreen.navigationOptions = navigationStyle({
  presentation: 'transparentModal',
  headerShown: false,
});
