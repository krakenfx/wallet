import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import type { Theme } from '@/theme/themes';
import { useTheme } from '@/theme/themes';

import loc from '/loc';

const permissions = [loc.connectApp.see_balance, loc.connectApp.request_approval];

type Props = {
  backgroundColor?: keyof Theme['colors'];
};

export const ConnectAppPermissions = ({ backgroundColor }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.listContainer, { backgroundColor: backgroundColor ? colors[backgroundColor] : colors.dark15 }]}>
      {permissions.map((permission, i) => {
        return (
          <View style={styles.listItem} key={permission + '_' + i}>
            <View style={styles.listItemMarker}>
              <SvgIcon name="check-circle-filled" color="green500" />
            </View>
            <Label type="regularBody">{permission}</Label>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  listItemMarker: {
    marginRight: 10,
  },
});
