import type { PropsWithChildren } from 'react';

import noop from 'lodash/noop';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';

import { MenuOverlay } from './MenuOverlay';

import type { MenuOverlayProps, PopupMenuProps } from './MenuOverlay';

interface MenuContextProps {
  hide: () => void;
  setVisible: (visible: boolean) => void;
  show: (props: MenuOverlayProps) => void;
  update: (props: PopupMenuProps<any>) => void;
  isShown: boolean;
}

const MenuContext = React.createContext<MenuContextProps>({
  hide: noop,
  show: noop,
  update: noop,
  setVisible: noop,
  isShown: false,
});

export const MenuProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [props, setProps] = useState<MenuOverlayProps>();
  const [visible, setVisible] = useState(false);

  const show = (newProps: MenuOverlayProps) => {
    setProps(newProps);
    setVisible(true);
  };

  const update = (newProps: PopupMenuProps<any>) => {
    setProps({ ...props, ...newProps } as MenuOverlayProps);
  };

  const hide = () => {
    setProps(undefined);
    setVisible(false);
  };

  const Container = Platform.OS === 'ios' ? FullWindowOverlay : View;

  return (
    <>
      <MenuContext.Provider value={{ hide, show, update, setVisible, isShown: !!visible }}>
        {children}
        {props && (
          <Container style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <MenuOverlay {...props} />
          </Container>
        )}
      </MenuContext.Provider>
    </>
  );
};

export const useMenu = (): MenuContextProps => React.useContext(MenuContext);
