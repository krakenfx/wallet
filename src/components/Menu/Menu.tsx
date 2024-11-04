import type { PropsWithChildren } from 'react';

import type { GestureResponderEvent, LayoutChangeEvent, LayoutRectangle } from 'react-native';

import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

import { Touchable } from '@/components/Touchable';

import { useMenu } from './MenuProvider';

import type { PopupMenuProps } from './MenuOverlay';

type OwnProps = {
  menuYOffset?: number;
  menuXOffset?: number;
  menuWidth?: number;
  onShow?: () => void;
  disabled?: boolean;
  refreshKey?: unknown; 
  testID?: string;
};

export type MenuComponentProps<T> = PropsWithChildren & PopupMenuProps<T> & OwnProps;

export function Menu<T>({ children, menuYOffset = 8, menuXOffset = 0, menuWidth, onShow, disabled, refreshKey, testID, ...props }: MenuComponentProps<T>) {
  const menu = useMenu();
  const layout = useRef<LayoutRectangle>();

  const showMenu = ({ nativeEvent }: GestureResponderEvent) => {
    if (!layout.current) {
      return;
    }
    onShow?.();
    menu.show({
      ...props,
      origin: {
        
        y: nativeEvent.pageY + layout.current.height - nativeEvent.locationY + menuYOffset,
        x: nativeEvent.pageX,
        offsetX: menuXOffset,
        
        elementHeight: layout.current.height + menuYOffset * 2,
      },
      menuWidth,
    });
  };

  useEffect(() => {
    if (!menu.isShown) {
      return;
    }
    menu.update(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const onLayout = (e: LayoutChangeEvent) => {
    layout.current = e.nativeEvent.layout;
  };

  return (
    <Touchable onLayout={onLayout} onPress={showMenu} disabled={disabled} testID={testID}>
      <View pointerEvents="box-only">{children}</View>
    </Touchable>
  );
}
