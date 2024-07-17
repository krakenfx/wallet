import { Platform } from 'react-native';

import { FlashListWithRefreshAndroid } from './FlashListWithRefreshAndroid';
import { FlashListWithRefreshIOS } from './FlashListWithRefreshIOS';
import { ScrollViewWithRefreshAndroid } from './ScrollViewWithRefreshAndroid';
import { ScrollViewWithRefreshIOS } from './ScrollViewWithRefreshIOS';

export const ScrollViewWithRefreshControl = Platform.select({
  ios: ScrollViewWithRefreshIOS,
  default: ScrollViewWithRefreshAndroid,
});

export const FlashListWithRefreshControl = Platform.select({
  ios: FlashListWithRefreshIOS,
  default: FlashListWithRefreshAndroid,
});
