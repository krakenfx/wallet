import { StyleSheet, View } from 'react-native';

import Share from 'react-native-share';

import type { ContextMenuItem } from '@/components/Menu';
import { Menu } from '@/components/Menu';
import { SvgIcon } from '@/components/SvgIcon';

import { useBrowserContext } from '../../context/BrowserContext';

import { useConnectionContext } from '../../context/ConnectionContext';

import loc from '/loc';

export const BrowserQuickActionsButton = () => {
  const { url, onRefreshPage } = useBrowserContext();
  const { isConnected, handleDisconnect } = useConnectionContext();

  const share = () => {
    if (!url) {
      return;
    }

    Share.open({ message: url });
  };

  const items: ContextMenuItem[] = [
    {
      title: loc.browser.quickActions.refresh,
      icon: 'redo',
      onPress: onRefreshPage,
    },
    {
      title: loc.browser.quickActions.share,
      icon: 'share',
      onPress: share,
    },
  ];

  if (isConnected) {
    items.push({
      title: loc.browser.quickActions.disconnect,
      tintColor: 'red400',
      icon: 'plug-disconnected',
      onPress: handleDisconnect,
    });
  }

  return (
    <View style={styles.container}>
      <Menu type="context" menuYOffset={20} menuXOffset={-30} items={items}>
        <SvgIcon style={styles.icon} name="more" color="light75" size={24} />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    transform: [{ rotate: '90deg' }],
  },
});
