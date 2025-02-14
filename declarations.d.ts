declare module '*.svg' {
  import type React from 'react';
  import type { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.raw' {
  const content: string;
  export default content;
}

declare module 'react-native-bootsplash';
declare module 'react-native-argon2';
declare module 'coinselect/split';
declare module 'coinselect';

declare type RequestCredentials = RequestCredentials_;

declare type StringNumber = string;

declare module 'react-native-config' {
  export interface NativeConfig {
    DEFAULT_HARMONY_BASE_URI: string;
    ALT_HARMONY_BASE_URIS_1?: string;
    ALT_HARMONY_BASE_URIS_2?: string;
    HARMONY_CF_CLIENT_ID?: string;
    HARMONY_CF_CLIENT_SECRET?: string;
    DEFAULT_GROUNDCONTROL_BASE_URI: string;
    ALT_GROUNDCONTROL_BASE_URIS_1?: string;
    ALT_GROUNDCONTROL_BASE_URIS_2?: string;
    WALLETCONNECT_PROJECT_ID: string;
    DISABLE_PREVENT_SCREEN_CAPTURE?: boolean;
    INTERNAL_RELEASE?: string;
    STORYBOOK_ENABLED?: string;
    KRAKEN_API_URI: string;
    KRAKEN_CONNECT_CLIENT_ID: string;
    KRAKEN_CONNECT_OAUTH_AUTH_URI: string;
    KRAKEN_BETA_API_URI: string;
    PERSONAL_API_KEY?: string;
    PERSONAL_PRIVATE_KEY?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module 'react-native-password-strength-meter/src/utils/calculate-level' {
  function calculateLevel<T extends object>(score: number, levels: T[]): T;
  export default calculateLevel;
}
declare module 'react-native-password-strength-meter/src/utils/score-password' {
  type Variations = {
    digits: RegExp;
    lower: RegExp;
    upper: RegExp;
    nonWords: RegExp;
  };
  function scorePassword(password: string, minLength: number, scoreLimit: number, variations?: Variations): number;
  export default scorePassword;
}
