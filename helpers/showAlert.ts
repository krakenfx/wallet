import { Alert } from 'react-native';

import loc from '/loc';

export const showAlert = async (title = loc.confirm.title, text = '', yesText = loc.confirm.yes, noText = loc.confirm.no): Promise<boolean> => {
  const result = await new Promise<boolean>(resolve => {
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
  return result;
};
