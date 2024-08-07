import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';

export const GradientPanelHeader = ({ children }: PropsWithChildren) => {
  return <GradientPanelBase stylesKey="header">{children}</GradientPanelBase>;
};

export const GradientPanel = ({ children }: PropsWithChildren) => {
  return <GradientPanelBase stylesKey="panel">{children}</GradientPanelBase>;
};

export const GradientPanelFooter = ({ children }: PropsWithChildren) => {
  return <GradientPanelBase stylesKey="footer">{children}</GradientPanelBase>;
};

const GradientPanelBase = ({ children, stylesKey }: PropsWithChildren & { stylesKey: keyof typeof styles }) => {
  return (
    <View style={styles[stylesKey]}>
      <GradientItemBackground />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginBottom: 1,
    overflow: 'hidden',
  },
  panel: {
    marginBottom: 1,
    overflow: 'hidden',
  },
  footer: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
});
