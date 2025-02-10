import { useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { AvatarIcon } from '@/components/AvatarIcon/AvatarIcon';
import { BottomSheet, type BottomSheetModalRef } from '@/components/BottomSheet';
import { Button } from '@/components/Button/Button';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer/FloatingBottomContainer';
import { GradientItemBackground } from '@/components/GradientItemBackground/GradientItemBackground';
import { Label } from '@/components/Label/Label';
import { SvgIcon } from '@/components/SvgIcon/SvgIcon';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useAccountById } from '@/realm/accounts/useAccountById';
import { useCurrentAccountNumber } from '@/realm/accounts/useCurrentAccountNumber';
import { useSettingsMutations } from '@/realm/settings/useSettingsMutations';
import type { NavigationProps } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import { KrakenAccountInstructions } from './components/KrakenAccountInstructions';

import loc from '/loc';

export type KrakenConnectNavigationParams = {
  selectedAccountNumber?: number;
};

export const KrakenConnectScreen = ({ navigation, route }: NavigationProps<'KrakenConnect'>) => {
  const { params = {} } = route;
  const { selectedAccountNumber } = params;
  const currentAccountNumber = useCurrentAccountNumber();
  const accountNumber = selectedAccountNumber ?? currentAccountNumber;
  const account = useAccountById(accountNumber);
  const accountName = account.accountCustomName;
  const alertString = loc.formatString(loc.krakenConnect.unconnected.alert, { walletName: accountName }).toString();
  const { bottomSheetProps } = useBottomSheetScreenProps(navigation);
  const bottomSheetModalRef = useRef<BottomSheetModalRef>(null);
  const { setExchangeConnectForAccount } = useSettingsMutations();

  const openPanel = () => {
    bottomSheetModalRef.current?.expand();
  };

  const connectToKraken = () => {
    setExchangeConnectForAccount(accountNumber);
  };

  return (
    <>
      <BottomSheet snapPoints={['100%']} {...bottomSheetProps}>
        <View style={styles.body}>
          <View>
            <Image style={styles.image} source={require('@/assets/images/krakenConnect/Futures.png')} />
            <Label style={styles.labelContainer} type="boldDisplay2">
              {loc.krakenConnect.unconnected.title}
            </Label>
            <Label style={styles.labelContainer} type="regularBody">
              {loc.krakenConnect.unconnected.body}
            </Label>
          </View>

          <FloatingBottomContainer style={styles.buttons}>
            <View style={styles.alert}>
              <GradientItemBackground backgroundType={'modal'} />
              <AvatarIcon accountNumber={account.accountNumber} accountAvatar={account.avatar} avatarSize={36} />
              <Label style={styles.alertBody} type="regularCaption1">
                {alertString}
              </Label>
              <SvgIcon name="info-circle" color="light75" />
            </View>
            <Button size="large" icon="kraken" color="kraken" text={loc.krakenConnect.unconnected.cta} onPress={connectToKraken} />
            <Button size="large" text={loc.krakenConnect.unconnected.noAccount} onPress={openPanel} />
          </FloatingBottomContainer>
        </View>
      </BottomSheet>
      <KrakenAccountInstructions ref={bottomSheetModalRef} />
    </>
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

KrakenConnectScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'transparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
