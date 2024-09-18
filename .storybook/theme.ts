import { Theme } from '@storybook/react-native';
import { SuperDarkTheme } from '../src/theme/themes';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export const krakenTheme: DeepPartial<Theme> = {
  backgroundColor: SuperDarkTheme.colors.background,
  preview: {
    containerBackgroundColor: SuperDarkTheme.colors.dark100,
    backgroundColor: SuperDarkTheme.colors.background,
  },
  text: {
    primaryColor: SuperDarkTheme.colors.kraken,
  },
  navigation: {
    backgroundColor: SuperDarkTheme.colors.background,
    borderColor: SuperDarkTheme.colors.kraken,
    visibilityBorderRadius: 10,
  },
  tabs: {
    activeBorderColor: SuperDarkTheme.colors.kraken,
    activeBackgroundColor: SuperDarkTheme.colors.background,
    activeTextColor: SuperDarkTheme.colors.light100,
  },
  panel: {
    backgroundColor: SuperDarkTheme.colors.background,
    borderColor: SuperDarkTheme.colors.kraken,
  },
  storyList: {
    headerTextColor: SuperDarkTheme.colors.light100,
    storySelectedBackgroundColor: SuperDarkTheme.colors.purple_40,
    storySelectedTextColor: SuperDarkTheme.colors.lavenderIndigo,
    sectionActiveBackgroundColor: SuperDarkTheme.colors.purple_40,
    search: {
      textColor: SuperDarkTheme.colors.light100,
      placeholderTextColor: SuperDarkTheme.colors.light75,
      borderRadius: 10,
      borderColor: SuperDarkTheme.colors.kraken,
      backgroundColor: SuperDarkTheme.colors.background,
    },
  },
  inputs: {
    labelTextColor: SuperDarkTheme.colors.text,
    text: {
      textColor: SuperDarkTheme.colors.dark100,
      backgroundColor: SuperDarkTheme.colors.light75,
    },
  },
};
