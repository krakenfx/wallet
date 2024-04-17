import { HeaderHeightContext } from '@react-navigation/elements';
import React, { useContext } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { useDeafultHeaderHeight } from '@/hooks/useDefaultHeaderHeight';

import { MainGradientView } from '/modules/gradient-view';

interface Props extends ViewProps {
  insetHeaderHeight?: boolean;
  fallbackToDefaultHeader?: boolean;
}

export const GradientScreenView: React.FC<Props> = ({ children, insetHeaderHeight = true, fallbackToDefaultHeader, ...props }) => {
  const headerheight = useContext(HeaderHeightContext);
  const defaultHeaderHeight = useDeafultHeaderHeight(insetHeaderHeight);
  const topOffset = headerheight || fallbackToDefaultHeader ? defaultHeaderHeight : 0;

  return (
    <View style={styles.default} {...props}>
      <MainGradientView style={StyleSheet.absoluteFill} />
      {insetHeaderHeight && <View style={{ height: topOffset }} />}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  default: {
    flex: 1,
  },
});
