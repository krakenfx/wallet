import type { SectionListData, SectionListRenderItem } from 'react-native';

import { BottomSheetSectionList } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { useBottomSheetPadding } from '@/hooks/useBottomSheetPadding';
import type { Network } from '@/onChain/wallets/base';
import { Networks } from '@/onChain/wallets/registry';
import { useAccounts, useCurrentAccountNumber } from '@/realm/accounts';
import type { RealmAccount } from '@/realm/accounts';
import { AddressSelector } from '@/screens/Send/components/AddressSelector';
import type { AddressAnalysis } from '@/screens/Send/hooks/useAddressAnalysis';
import { useFormContext } from '@/screens/Send/utils/sendForm';

import { AccountReceiveItem } from './AccountReceiveItem';

import loc from '/loc';

type Section = {
  key: 'my_wallets';
  label: string;
  data: RealmResults<RealmAccount>;
};

type SectionType = SectionListData<RealmAccount, Section>;

type Props = {
  address: string;
  addressOrEns: string;
  onContinue: () => void;
  setAddressOrEns: (value: string) => void;
  setAddress: (value: string) => void;
  setSupportedNetworks: (networks: Network[]) => void;
  addressAnalysis: AddressAnalysis;
  sendToAccount: (account: RealmAccount) => void;
  onScanRequest: () => void;
};

export const SendTo = ({
  address,
  addressOrEns,
  setAddressOrEns,
  setAddress,
  addressAnalysis,
  setSupportedNetworks,
  onContinue,
  sendToAccount,
  onScanRequest,
}: Props) => {
  const accounts = useAccounts();
  const currentAccountNumber = useCurrentAccountNumber();

  const { isFormValid } = useFormContext();

  const allNetworks = useMemo(() => Object.values(Networks), []);

  const onChangeAddress = useCallback(
    (value: string) => {
      setAddressOrEns(value);
      setAddress(value);
    },
    [setAddress, setAddressOrEns],
  );

  const onValidName = useCallback(
    (name: string, resolvedAddress: string) => {
      setAddress(resolvedAddress);
      setAddressOrEns(name);
    },
    [setAddress, setAddressOrEns],
  );

  useEffect(() => {
    if (isFormValid && address) {
      const validNetworks = allNetworks.filter(n => n.isAddressValid(address));
      setSupportedNetworks(validNetworks);
    } else {
      setSupportedNetworks([]);
    }
  }, [address, allNetworks, isFormValid, setSupportedNetworks]);

  const sections: SectionType[] = useMemo(() => {
    return [
      {
        key: 'my_wallets',
        label: loc.universalSend.myWallets,
        data: accounts.filtered('accountNumber != $0', currentAccountNumber),
      },
    ];
  }, [accounts, currentAccountNumber]);

  const renderHeader = useCallback(
    ({ section }: { section: SectionListData<RealmAccount, Section> }) =>
      section.data.length > 0 ? (
        <Label color="light50" type="boldTitle2">
          {section.label}
        </Label>
      ) : null,
    [],
  );

  const renderSectionItem: SectionListRenderItem<RealmAccount, Section> = useCallback(
    ({ item, section }) => (section.key === 'my_wallets' ? <AccountReceiveItem account={item} sendToAccount={sendToAccount} /> : null),
    [sendToAccount],
  );

  const marginBottom = useBottomSheetPadding(false, 16);

  return (
    <>
      <Animated.View style={styles.header} exiting={FadeOut}>
        <Label type="boldDisplay4" style={styles.listHeader}>
          {loc.universalSend.sendTo}
        </Label>
        <AddressSelector
          onValidName={onValidName}
          networks={allNetworks}
          address={addressOrEns}
          onChangeAddress={onChangeAddress}
          onScanRequest={onScanRequest}
          autoFocus={accounts.length < 2}
          addressAnalysis={addressAnalysis}
        />
      </Animated.View>
      {!addressOrEns && (
        <BottomSheetSectionList
          entering={FadeIn}
          exiting={FadeOut}
          sections={sections}
          style={[styles.scrollView, { marginBottom }]}
          contentInsetAdjustmentBehavior="automatic"
          renderItem={renderSectionItem}
          renderSectionHeader={renderHeader}
          stickySectionHeadersEnabled={false}
          automaticallyAdjustContentInsets
        />
      )}
      <FloatingBottomButtons
        primary={{
          disabled: !isFormValid || addressAnalysis.isLoading,
          text: loc.universalSend.continue,
          onPress: onContinue,
          style: styles.button,
          testID: 'ContinueBtn',
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 24,
  },
  scrollView: {
    paddingHorizontal: 24,
  },
  listHeader: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  divider: {
    height: 6,
  },
  button: {
    marginBottom: 16,
  },
});
