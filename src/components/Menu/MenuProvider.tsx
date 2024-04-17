import noop from 'lodash/noop';
import React, { PropsWithChildren, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';

import { MenuOverlay, MenuOverlayProps, PopupMenuProps } from './MenuOverlay';

interface MenuContextProps {
  hide: () => void;
  show: (props: MenuOverlayProps) => void;
  update: (props: PopupMenuProps<any>) => void;
  isShown: boolean;
}

const MenuContext = React.createContext<MenuContextProps>({
  hide: noop,
  show: noop,
  update: noop,
  isShown: false,
});

export const MenuProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [props, setProps] = useState<MenuOverlayProps>();

  const show = (newProps: MenuOverlayProps) => {
    setProps(newProps);
  };

  const update = (newProps: PopupMenuProps<any>) => {
    setProps({ ...props, ...newProps } as MenuOverlayProps);
  };

  const hide = () => {
    setProps(undefined);
  };

  const Container = Platform.OS === 'ios' ? FullWindowOverlay : View;

  return (
    <>
      <MenuContext.Provider value={{ hide, show, update, isShown: !!props }}>
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
