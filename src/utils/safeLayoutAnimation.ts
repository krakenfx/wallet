import { LayoutAnimation, Platform } from 'react-native';

export const safelyAnimateLayout = () => {
  if (Platform.OS === 'ios') {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  } else {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
  }
};
