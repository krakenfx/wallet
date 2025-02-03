import type { StatusBarStyle } from 'react-native';

import { DarkTheme, useTheme as useThemeBase } from '@react-navigation/native';

export const SuperDarkTheme = {
  ...DarkTheme,
  barStyle: 'light-content' as StatusBarStyle,
  spacing: {
    half: 8,
    full: 16,
  },
  border: {
    width: 0,
  },
  colors: {
    ...DarkTheme.colors,

    kraken: '#7538F5',
    background: '#0D0D2E',

    green500: '#3DA667',
    green400: '#62DD93',

    red500: '#C63333',
    red400: '#EC6D6D',

    yellow600: '#FF8745',
    yellow500: '#E7954A',

    grey500: '#333354',

    light100: 'rgba(255, 255, 255, 1)',
    light75: 'rgba(255, 255, 255, 0.75)',
    light50: 'rgba(255, 255, 255, 0.5)',
    light35: 'rgba(255,255, 2555, 0.35)',
    light15: 'rgba(255, 255, 255, 0.15)',
    light8: 'rgba(255, 255, 255, 0.08)',
    light2: 'rgba(255, 255, 255, 0.02)',

    dark100: 'rgba(0, 0, 0, 1)',
    dark50: 'rgba(0, 0, 0, 0.5)',
    dark25: 'rgba(0, 0, 0, 0.25)',
    dark15: 'rgba(0, 0, 0, 0.15)',

    purple_10: 'rgba(100, 81, 170, 0.10)',
    purple_15: 'rgba(100, 81, 170, 0.15)',
    purple_20: 'rgba(100, 81, 170, 0.20)',
    purple_30: 'rgba(100, 81, 170, 0.30)',
    purple_40: 'rgba(100, 81, 170, 0.40)',
    purple_60: 'rgba(100, 81, 170, 0.60)',

    transparent: 'rgba(0,0,0,0)',
    red400_15: 'rgba(236, 109, 109, 0.15)',
    green400_15: 'rgba(98, 221, 147, 0.15)',
    yellow500_15: 'rgba(231, 149, 74, 0.15)',
    martinique: '#323253',
    iOSKeyboardAccessoryBg: '#1B192B',
    androidDarkBlurBg: '#6363C7',
    androidToastBlur: '#1F154F',
    swapIconBorder: '#1A143F',
    swapIconBg: '#251D4F',
    coreBackground: '#0E0E35',
    blurBackgroundAndroid: '#302C3E',
    lavenderIndigo: '#8B58F7',
    tooltipColor: '#3E367C',
  },
  gradients: {
    itemBackground: {
      stop1: 'rgb(133,145,255)',
      stop2: 'rgb(140,121,255)',
      stop3: 'rgb(140,121,255)',
    },
  },
};

export type Theme = typeof SuperDarkTheme;

export type ColorName = keyof Theme['colors'];

export const useTheme = (): Theme => useThemeBase() as Theme;
