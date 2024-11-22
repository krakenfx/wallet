import { useNavigation } from '@react-navigation/native';

import { StyleSheet, View } from 'react-native';

import { IconWithCoinIcon } from '@/components/IconWithCoinIcon';
import { Label } from '@/components/Label';
import { Pill } from '@/components/Pill';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useBottomSheetPadding } from '@/hooks/useBottomSheetPadding';
import { Routes } from '@/Routes';

import loc from '/loc';

type Props = {
  testID: string;
};

const WALLET_CONNECT_NAME = 'WalletConnect';

export const EmptyState = ({ testID }: Props) => {
  const marginBottom = useBottomSheetPadding();
  const navigation = useNavigation();

  const openExplainer = () => navigation.navigate(Routes.WalletConnectExplainer);

  return (
    <View style={[stylesEmptyState.container, { marginBottom }]} testID={testID}>
      <IconWithCoinIcon icon={<SvgIcon name="walletconnect" size={40} />} maskShape="rounded-square" size={76} />
      <Label style={stylesEmptyState.title} type="boldTitle1">
        {WALLET_CONNECT_NAME}
      </Label>
      <Label style={stylesEmptyState.instructions} type="regularBody" color="light75">
        {loc.scan.instructions}
      </Label>
      <Touchable onPress={openExplainer}>
        <Pill backgroundColor="light15">
          <SvgIcon name="info-circle" size={16} />
          <Label type="boldCaption1">{loc.connectedApps.list.tutorial}</Label>
        </Pill>
      </Touchable>
    </View>
  );
};

const stylesEmptyState = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    marginBottom: 8,
    marginTop: 8,
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 24,
  },
});
