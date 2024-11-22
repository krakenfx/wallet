import type React from 'react';

import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import type { TypographyKey } from '@/components/Label';
import { Label } from '@/components/Label';
import type { IconName } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

export type DropdownOptionItem<T> = {
  id: T;
  labelLeft: string;
  labelRight?: string;
  labelBottomLeft?: string;
  labelBottomRight?: string;
  icon?: IconName | React.ReactElement;
  disabled?: boolean;
};

export type DropdownMenuProps<T> = {
  options: DropdownOptionItem<T>[];
  title?: string;
  checkSelected?: boolean;
  selectedId: T;
  closeOnSelect?: boolean;
  labelLeftType?: TypographyKey;
  onSelect: (item: DropdownOptionItem<T>) => void;
};

export function DropdownMenu<T>({
  title,
  options,
  selectedId: initiallySelectedId,
  checkSelected,
  labelLeftType,
  onSelect,
  closeOnSelect = true,
  onClose,
}: DropdownMenuProps<T> & { onClose: () => void }) {
  const theme = useTheme();

  const [selectedId, setSelectedId] = useState(initiallySelectedId);

  const renderTitle = () => (
    <Label type="mediumCaption1" style={styles.dropdownTitle} color="light50">
      {title}
    </Label>
  );

  const onItemSelected = (item: DropdownOptionItem<T>) => {
    onSelect(item);
    setSelectedId(item.id);
    if (closeOnSelect) {
      onClose();
    }
  };

  return (
    <FlatList
      bounces={false}
      data={options}
      keyExtractor={item => String(item.id)}
      ListHeaderComponent={title ? renderTitle : null}
      contentContainerStyle={styles.scroll}
      renderItem={({ item }) => (
        <Touchable
          disabled={item.disabled}
          style={[styles.dropdownItem, item.disabled && styles.disabled]}
          onPress={() => {
            onItemSelected(item);
          }}>
          {item.id === selectedId && <View style={[styles.dropDownHighlight, { backgroundColor: theme.colors.purple_40 }]} />}
          <View style={styles.left}>
            {item.icon && typeof item.icon === 'string' ? <SvgIcon name={item.icon} /> : item.icon}
            <Label type={labelLeftType}>{item.labelLeft}</Label>
            {!!item.labelBottomLeft && (
              <Label type="regularCaption1" color="light50">
                {item.labelBottomLeft}
              </Label>
            )}
          </View>
          <View style={styles.right}>
            {!!item.labelRight && <Label type="boldMonospace">{item.labelRight}</Label>}
            {item.id === selectedId && checkSelected && <SvgIcon name="check-circle-filled" size={16} />}
            {!!item.labelBottomRight && (
              <Label type="regularCaption1" color="light50">
                {item.labelBottomRight}
              </Label>
            )}
          </View>
        </Touchable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  dropdownTitle: {
    marginBottom: 16,
    marginLeft: 16,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 54,
  },
  dropDownHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
  },
  left: {
    alignItems: 'flex-start',
    gap: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  scroll: {
    padding: 16,
  },
  disabled: {
    opacity: 0.25,
  },
});
