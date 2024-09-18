import AsyncStorage from '@react-native-async-storage/async-storage';
import { view } from './storybook.requires';
import { krakenTheme } from './theme';

const StorybookUIRoot = view.getStorybookUI({
  theme: krakenTheme,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

export default StorybookUIRoot;
