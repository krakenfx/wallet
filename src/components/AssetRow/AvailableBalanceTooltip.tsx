import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { Menu, useMenu } from '@/components/Menu';

import { SvgIcon } from '@/components/SvgIcon';
import { useBrowser } from '@/hooks/useBrowser';

import loc from '/loc';

export const AvailableBalanceTooltip = () => {
  const { openURL } = useBrowser();

  const menu = useMenu();

  const openKrakenLink = () => {
    menu.hide();
    openURL('https://support.kraken.com/hc/en-us/articles/360000389606-Why-is-there-a-withdrawal-hold-on-my-account-');
  };
  return (
    <Menu
      menuWidth={300}
      horizontalTipOffset={154}
      menuYOffset={15}
      type="tooltip"
      tooltip={
        <View style={styles.container}>
          <Label type="regularCaption1" color="light75">
            {loc.krakenConnect.availableBalanceInfo.title}
          </Label>
          <Label type="boldCaption1">
            {loc.krakenConnect.availableBalanceInfo.description} <SvgIcon name="open-external" size={14} style={styles.tooltipIcon} onPress={openKrakenLink} />
          </Label>
        </View>
      }>
      <SvgIcon name="info-circle" size={16} color="light50" style={styles.tooltipIcon} />
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  tooltipIcon: {
    marginLeft: 4,
    marginBottom: -2,
  },
});
