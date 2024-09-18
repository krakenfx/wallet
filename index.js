import 'react-native-reanimated'
import { AppRegistry } from 'react-native';
import { STORYBOOK_ENABLED } from '/config';
import './shim';
import App from './src/App';

if (__DEV__ && STORYBOOK_ENABLED === 'true') {
  AppRegistry.registerComponent('SuperWallet', () => require('./.storybook').default);
} else {
  AppRegistry.registerComponent('SuperWallet', () => App);
}

