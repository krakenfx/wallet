import { StyleSheet, View } from 'react-native';

import { AvatarIcon } from '@/components/AvatarIcon/AvatarIcon';
import { GradientItemBackground } from '@/components/GradientItemBackground/GradientItemBackground';
import { Label } from '@/components/Label/Label';
import { useAccountById } from '@/realm/accounts/useAccountById';

import loc from '/loc';

type KrakenConnectWalletAlertProps = {
  accountNumber: number;
  message: string;
};

export const KrakenConnectWalletAlert = ({ accountNumber, message }: KrakenConnectWalletAlertProps) => {
  const account = useAccountById(accountNumber);
  const accountName = account.accountCustomName;
  const alertString = loc.formatString(message, { walletName: accountName }).toString();
  return (
    <View style={styles.alert}>
      <GradientItemBackground backgroundType={'modal'} />
      <AvatarIcon accountNumber={account.accountNumber} accountAvatar={account.avatar} avatarSize={36} />
      <Label style={styles.alertBody} type="regularCaption1">
        {alertString}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  image: {
    alignSelf: 'center',
  },
  alert: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    gap: 16,
    overflow: 'hidden',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertBody: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
  },
  buttons: {
    marginHorizontal: 16,
    gap: 16,
  },
  labelContainer: {
    marginBottom: 16,
  },
});
