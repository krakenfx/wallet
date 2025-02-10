import { ScrollView, StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground/GradientItemBackground';
import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { WalletItem } from '@/components/WalletItem/WalletItem';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { useAccounts } from '@/realm/accounts';
import { navigationStyle } from '@/utils/navigationStyle';

import { CircleIcon } from '../../../components/CircleIcon/CircleIcon';
import { SettingsCheckItemsBox } from '../components';

import loc from '/loc';

const BENEFITS = [loc.krakenConnect.settings.benefits0, loc.krakenConnect.settings.benefits1];

const Benefit = ({ text }: { text: string }) => {
  return (
    <View style={styles.benefit}>
      <Label color="light50" style={styles.benefitText}>
        {text}
      </Label>
      <SvgIcon name="check-circle-filled" color="green400" />
    </View>
  );
};

export const ManageConnectionsScreen = () => {
  const accounts = useAccounts();

  useHeaderTitle(loc.settings.krakenConnect);

  return (
    <GradientScreenView>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <GradientItemBackground />
          <View style={styles.header}>
            <CircleIcon style={styles.icon} name="kraken" backgroundColor="kraken" iconColor="light100" size={32} iconSize={19} />
            <Label type="boldCaption1">{loc.krakenConnect.settings.benefitsHeadline}</Label>
          </View>
        </View>
        <SettingsCheckItemsBox>
          {BENEFITS.map((b, index) => (
            <Benefit text={b} key={`${b}_${index}`} />
          ))}
        </SettingsCheckItemsBox>
        <Label type="boldTitle2" color="light100" style={styles.walletHeaderTitle}>
          {loc.krakenConnect.settings.walletsListTitle}
        </Label>
        {accounts.map((account, index) => {
          const isLast = index === accounts.length - 1;
          return <WalletItem account={account} isFirst={index === 0} isLast={isLast} key={account + ' ' + index} showMenu={false} showKrakenConnect={true} />;
        })}
      </ScrollView>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: 16,
    marginBottom: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  benefit: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  benefitText: {
    flexShrink: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  cloudBackup: {
    marginTop: 16,
  },
  backupSuggested: {
    marginTop: 16,
  },
  walletHeaderTitle: {
    marginTop: 24,
    marginBottom: 16,
    paddingLeft: 12,
  },
  walletHeader: {
    marginBottom: 1,
  },
});

ManageConnectionsScreen.navigationOptions = navigationStyle({ headerTransparent: true });
