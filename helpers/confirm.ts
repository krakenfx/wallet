import { Alert } from 'react-native';

import loc from '/loc';

export default function (title = loc.confirm.title, text = '', yesText = loc.confirm.yes, noText = loc.confirm.no): Promise<boolean> {
  return new Promise(resolve => {
    Alert.alert(
      title,
      text,
      [
        {
          text: yesText,
          onPress: () => resolve(true),
          style: 'default',
        },
        {
          text: noText,
          onPress: () => resolve(false),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  });
}
