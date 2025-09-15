import { useCallback, useEffect, useMemo, useState } from 'react';

import { BottomSheet } from '@/components/BottomSheet';
import { showToast } from '@/components/Toast';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useGetWalletStorage } from '@/hooks/useGetWalletStorage';
import type { Network } from '@/onChain/wallets/base';
import { Networks, getImplForWallet } from '@/onChain/wallets/registry';
import type { RealmAccount } from '@/realm/accounts';
import { useRealm } from '@/realm/RealmContext';
import type { RealmToken } from '@/realm/tokens';
import { getWalletsForMutations } from '@/realm/wallets';
import { Routes } from '@/Routes';
import type { NavigationProps } from '@/Routes';
import { getReceiveAddress } from '@/screens/Receive/hooks/useReceiveAddress';
import { useAddressAnalysis } from '@/screens/Send/hooks/useAddressAnalysis';
import { decodeQrCodeAddress } from '@/screens/Send/utils/decodeQrCodeAddress';
import { FormProvider } from '@/screens/Send/utils/sendForm';
import { useUnencryptedRealm } from '@/unencrypted-realm/RealmContext';
import { navigationStyle } from '@/utils/navigationStyle';

import { SendAsset, SendTo } from './components';

import loc from '/loc';

type ScreenMode = 'sendTo' | 'sendAsset';

export type UniversalSendRouteParams = {
  qrCode?: string;
};

const UniversalSend = ({ navigation, route: { params } }: NavigationProps<'UniversalSend'>) => {
  const { bottomSheetProps } = useBottomSheetScreenProps(navigation);

  const snapPoints = useMemo(() => ['100%'], []);
  const [address, setAddress] = useState<string>('');
  const [addressOrEns, setAddressOrEns] = useState<string>('');
  const [supportedNetworks, setSupportedNetworks] = useState<Network[]>([]);
  const [screenMode, setScreenMode] = useState<ScreenMode>('sendTo');
  const [ownAccountSelected, setOwnAccountSelected] = useState<RealmAccount>();

  const getWalletStorage = useGetWalletStorage();

  const addressAnalysis = useAddressAnalysis(supportedNetworks[0], address);

  const realm = useRealm();
  const unencryptedRealm = useUnencryptedRealm();

  const onContinue = () => {
    setScreenMode('sendAsset');
  };

  const goBack = useCallback(() => {
    setAddress('');
    setAddressOrEns('');
    setSupportedNetworks([]);
    setOwnAccountSelected(undefined);
    setScreenMode('sendTo');
  }, []);

  const { setParams } = navigation;

  const setAddressFromQrcode = useCallback(
    (value: string) => {
      setAddress(value);
      setAddressOrEns(value);
      setParams({ qrCode: '' });
    },
    [setParams],
  );

  useEffect(() => {
    if (params?.qrCode) {
      try {
        const value = decodeQrCodeAddress(params.qrCode);
        if (value) {
          setAddressFromQrcode(value.address);
          if (value.isEip681) {
            showToast({ type: 'info', text: loc.send.eip681Warning });
          }
        }
      } catch {
        setAddressFromQrcode(params.qrCode);
      }
    }
  }, [params?.qrCode, setAddressFromQrcode, setParams]);

  const sendToAccount = useCallback((account: RealmAccount) => {
    setScreenMode('sendAsset');
    setSupportedNetworks(Object.values(Networks));
    setOwnAccountSelected(account);
  }, []);

  const getTokenAddressForOwnAccount = useCallback(
    async (sendToken: RealmToken) => {
      if (!ownAccountSelected) {
        return;
      }
      const receiveWallet = getWalletsForMutations(realm, unencryptedRealm, true).filtered(
        'caipId == $0 AND accountIdx == $1',
        sendToken.wallet.caipId,
        ownAccountSelected.accountNumber,
      )[0];

      const { network: receiveNetwork, transport: receiveTransport } = getImplForWallet(receiveWallet);
      return await getReceiveAddress(receiveNetwork, receiveTransport, receiveWallet, getWalletStorage);
    },
    [getWalletStorage, ownAccountSelected, realm, unencryptedRealm],
  );

  const onAssetSelected = useCallback(
    async (sendToken: RealmToken) => {
      const sendToAddress = ownAccountSelected ? await getTokenAddressForOwnAccount(sendToken) : address;

      navigation.replace(Routes.SendStack, {
        screen: 'Send',
        params: {
          assetBalanceId: sendToken.id,
          address: sendToAddress,
          addressValue: addressOrEns,
          addressAnalysisCache: addressAnalysis.data,
          fromUniversalSend: true,
        },
      });
    },
    [address, addressOrEns, getTokenAddressForOwnAccount, navigation, ownAccountSelected, addressAnalysis],
  );

  const onScanRequest = () => navigation.navigate(Routes.SendQRScan, { ...params, routeBack: Routes.UniversalSend });

  return (
    <BottomSheet snapPoints={snapPoints} {...bottomSheetProps}>
      {screenMode === 'sendTo' ? (
        <SendTo
          address={address}
          addressOrEns={addressOrEns}
          addressAnalysis={addressAnalysis}
          setAddress={setAddress}
          setAddressOrEns={setAddressOrEns}
          onContinue={onContinue}
          setSupportedNetworks={setSupportedNetworks}
          sendToAccount={sendToAccount}
          onScanRequest={onScanRequest}
        />
      ) : (
        <SendAsset supportedNetworks={supportedNetworks} onAssetSelected={onAssetSelected} goBack={goBack} />
      )}
    </BottomSheet>
  );
};

export const UniversalSendScreen = (props: NavigationProps<'UniversalSend'>) => {
  return (
    <FormProvider requiredFields={['address']}>
      <UniversalSend {...props} />
    </FormProvider>
  );
};

UniversalSendScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'containedTransparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
