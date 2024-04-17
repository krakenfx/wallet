import Clipboard from '@react-native-clipboard/clipboard';
import { NativeModules, Platform } from 'react-native';

const SensitiveClipboard: { setString(content: string): void } = {
  setString: Platform.OS === 'android' ? NativeModules.SensitiveClipboard.setString : Clipboard.setString,
};

export default SensitiveClipboard;
