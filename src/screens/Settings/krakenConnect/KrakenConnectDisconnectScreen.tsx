import { StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer/FloatingBottomContainer';
import { GradientItemBackground } from '@/components/GradientItemBackground/GradientItemBackground';
import { Label } from '@/components/Label/Label';
import { ModalNavigationHeader } from '@/components/ModalNavigationHeader/ModalNavigationHeader';
import { SvgIcon } from '@/components/SvgIcon/SvgIcon';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useKrakenConnectClear } from '@/hooks/useKrakenConnectClear';
import { useAccountById } from '@/realm/accounts/useAccountById';
import { useCurrentAccountNumber } from '@/realm/accounts/useCurrentAccountNumber';
import type { NavigationProps } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import loc from '/loc';

export const KrakenConnectDisconnectScreen = ({ navigation, route }: NavigationProps<'KrakenConnectDisconnect'>) => {
  const { params = {} } = route;
  const { selectedAccountNumber } = params;
  const currentAccountNumber = useCurrentAccountNumber();
  const accountNumber = selectedAccountNumber ?? currentAccountNumber;
  const account = useAccountById(accountNumber);
  const accountName = account.accountCustomName;
  const { removeExchangeConnectForAccount } = useKrakenConnectClear();
  const { bottomSheetProps } = useBottomSheetScreenProps(navigation);
  const warningMessage = loc.formatString(loc.krakenConnect.settings.disconnectScreen.warningMessage, { walletName: accountName }).toString();
  const pressHandler =
    (disconnect: boolean = false) =>
    () => {
      if (disconnect) {
        removeExchangeConnectForAccount(accountNumber);
      }
      navigation.goBack();
    };

  return (
    <BottomSheet snapPoints={['100%']} {...bottomSheetProps}>
      <ModalNavigationHeader
        style={styles.headerContainer}
        title={<Label type="boldTitle2">{loc.krakenConnect.settings.disconnectScreen.title}</Label>}
        goBackOnly={true}
      />
      <View style={styles.textContainer}>
        <Label style={styles.bottomMargin} type="boldDisplay5">
          {loc.krakenConnect.settings.disconnectScreen.description}
        </Label>
        <Label style={styles.bottomMargin} type="regularTitle1" color="light75">
          {warningMessage}
        </Label>
      </View>
      <FloatingBottomContainer>
        <View style={styles.alert}>
          <GradientItemBackground backgroundType={'modal'} />
          <SvgIcon style={styles.warningIcon} name="warning" size={20} color="yellow500" />
          <Label style={styles.alertBody} type="regularCaption1">
            {loc.krakenConnect.settings.disconnectScreen.alert}
          </Label>
          <SvgIcon style={styles.infoIcon} name="info-circle" size={20} color="light50" />
        </View>
        <FloatingBottomButtons
          noAbsolutePosition
          secondary={{
            text: loc.krakenConnect.settings.cancel,
            onPress: pressHandler(),
            color: 'light15',
          }}
          primary={{
            color: 'red400',
            text: loc.krakenConnect.settings.disconnect,
            onPress: pressHandler(true),
          }}
        />
      </FloatingBottomContainer>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 8,
  },
  textContainer: {
    paddingHorizontal: 24,
  },
  bottomMargin: {
    marginBottom: 16,
  },
  alert: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginHorizontal: 24,
    gap: 8,
    overflow: 'hidden',
    marginBottom: 30,
  },
  alertBody: {
    flex: 1,
  },
  warningIcon: { alignSelf: 'flex-start' },
  infoIcon: { alignSelf: 'center', marginLeft: 8 },
});

KrakenConnectDisconnectScreen.navigationOptions = navigationStyle({
  presentation: 'transparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
