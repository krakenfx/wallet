import type { StyleProp, ViewStyle } from 'react-native';

import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getTokenIconFallbackProps } from '/generated/assetIcons';

type TokenIconFallbackProps = {
  size: number;
  tokenSymbol: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function arePropsEqual(oldProps: TokenIconFallbackProps, newProps: TokenIconFallbackProps) {
  return oldProps.tokenSymbol === newProps.tokenSymbol;
}

export const TokenIconFallback = memo(({ size, style, tokenSymbol, testID }: TokenIconFallbackProps) => {
  const { backgroundColor, label } = getTokenIconFallbackProps(tokenSymbol);

  return (
    <View style={[styles.ball, { backgroundColor, width: size, height: size, borderRadius: size / 2 }, style]} testID={testID}>
      <Text style={styles.tokenIconFallback} numberOfLines={1} allowFontScaling adjustsFontSizeToFit minimumFontScale={0.5}>
        {label}
      </Text>
    </View>
  );
}, arePropsEqual);

const styles = StyleSheet.create({
  ball: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenIconFallback: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 2,
  },
});
