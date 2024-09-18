import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { BitcoinNetwork } from '@/onChain/wallets/bitcoin';
import { getImplForWallet } from '@/onChain/wallets/registry';

import { useAccountById } from '@/realm/accounts/useAccountById';
import { Routes } from '@/Routes';
import { useSecuredKeychain } from '@/secureStore/SecuredKeychainProvider';

import loc from '/loc';

const WALLET_TYPE = 'HDsegwitBech32';

export const ExtendedPublicKey = ({ accountNumber, extendedPublicKey }: { accountNumber: number; extendedPublicKey: string }) => {
  const navigation = useNavigation();
  const { getSeed } = useSecuredKeychain();
  const [isGettingXpub, setIsGettingXpub] = useState(false);

  const account = useAccountById(accountNumber);
  const { wallet, network } = useMemo(() => {
    const btcWallet = account.wallets.find(w => w?.type === WALLET_TYPE);
    const network_ = btcWallet ? getImplForWallet(btcWallet).network : undefined;
    const btcNetwork = network_ instanceof BitcoinNetwork ? network_ : undefined;

    return { wallet: btcWallet, network: btcNetwork };
  }, [account.wallets]);

  
  if (!wallet || !network) {
    return null;
  }

  
  const showExtendedPublicKey = async () => {
    setIsGettingXpub(true);

    const seedData = await getSeed('getXPub');

    if (!seedData) {
      setIsGettingXpub(false);
      return;
    }

    const xpub = await network.getXYZPub({ ...wallet, seed: { data: seedData } });

    setIsGettingXpub(false);
    navigation.navigate(Routes.ExtendedPublicKey, { xpub });
  };

  return (
    <>
      <View style={styles.panelContent}>
        <Label type="regularCaption1" color="light75">
          {loc.advancedAccountInfo.extendedPublicKey}
        </Label>
        <Label type="boldBody">{extendedPublicKey}</Label>
      </View>
      <Button
        textType="boldCaption1"
        color="light15"
        icon="eye"
        iconColor="light100"
        iconSize={16}
        textColor="light100"
        size="medium"
        onPress={showExtendedPublicKey}
        text={loc._.view}
        style={styles.button}
        loading={isGettingXpub}
      />
    </>
  );
};

const styles = StyleSheet.create({
  panelContent: {
    gap: 4,
  },
  button: {
    height: 36,
    minWidth: 105,
    paddingHorizontal: 16,
  },
});
