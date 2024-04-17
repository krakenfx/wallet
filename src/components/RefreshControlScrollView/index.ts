import { Platform } from 'expo-modules-core';

import { RefreshControlScrollViewAndroid } from './RefreshControlScrollViewAndroid';
import { RefreshControlScrollViewIOS } from './RefreshControlScrollViewIOS';

export const RefreshControlScrollView = Platform.select({ ios: RefreshControlScrollViewIOS, default: RefreshControlScrollViewAndroid });
