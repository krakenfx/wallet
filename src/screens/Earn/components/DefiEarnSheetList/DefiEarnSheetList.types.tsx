import type { SharedValue } from 'react-native-reanimated';

import type { DefiProtocol } from '../DefiAssetProtocolRow/DefiAssetProtocolRow.types';

export interface DefiEarnSheetListProps {
  isHeaderShrunk: SharedValue<boolean>;
  scrollEnabled: boolean;
  protocols: DefiProtocol[];
  closeEarnSheet: () => void;
}
