import type { ReactElement } from 'react';

import type React from 'react';
import type { ListRenderItem } from 'react-native';

import { FlatList, StyleSheet } from 'react-native';

import { Label } from '@/components/Label';
import type { IconName } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import type { ColorName } from '@/theme/themes';

export type ContextMenuItem = {
  title: string;
  subtitle?: string;
  onPress: () => void;
  tintColor?: ColorName;
  icon: IconName | ReactElement;
  testID?: string;
};

export type ContextMenuProps = {
  items: ContextMenuItem[];
};

export const ContextMenu: React.FC<ContextMenuProps & { onClose: () => void }> = ({ items, onClose }) => {
  const onItemSelected = (item: ContextMenuItem) => {
    item.onPress();
    onClose();
  };

  const renderItem: ListRenderItem<ContextMenuItem> = ({ item }) => (
    <Touchable style={styles.item} onPress={() => onItemSelected(item)} testID={item.testID}>
      <Label color={item.tintColor}>{item.title}</Label>
      {typeof item.icon === 'string' ? <SvgIcon name={item.icon} color={item.tintColor} size={24} /> : item.icon}
    </Touchable>
  );
  return <FlatList bounces={false} data={items} keyExtractor={keyExtractor} contentContainerStyle={styles.scroll} renderItem={renderItem} />;
};

const keyExtractor = (item: ContextMenuItem) => item.title;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    height: 56,
  },
  scroll: {
    paddingVertical: 6,
  },
});
