import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';

import { NetworkIcon } from '@/components/NetworkIcon';
import { SvgIcon, SvgIconProps } from '@/components/SvgIcon';

import { Touchable } from '@/components/Touchable';

import { WalletType } from '@/onChain/wallets/registry';
import { Routes } from '@/Routes';
import { EXPLAINER_CONTENT_TYPES } from '@/screens/Explainer';
import { useTheme } from '@/theme/themes';

import loc from '/loc';

interface Props {
  contractAddress: string;
  networkName: WalletType | 'walletTypeUnknown';
}

const COPIED_STATE: Record<string, { name: SvgIconProps['name']; color: SvgIconProps['color'] }> = {
  PRISTINE: { name: 'copy', color: 'light75' },
  COPIED: { name: 'check-circle-filled', color: 'green400' },
};

const SHOW_CHECKMARK_DURATION = 2300;

export const ContractAddress = ({ contractAddress, networkName }: Props) => {
  const navigation = useNavigation();
  const [icon, setIcon] = useState(COPIED_STATE.PRISTINE);
  const { colors } = useTheme();

  const onPress = useCallback(async () => {
    setIcon(COPIED_STATE.COPIED);
    Clipboard.setString(contractAddress);
    navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.CONTRACT_ADDRESS });
    setTimeout(() => setIcon(COPIED_STATE.PRISTINE), SHOW_CHECKMARK_DURATION);
  }, [contractAddress, navigation]);

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} testID="ContractAddress">
      <Label type="boldTitle2" style={styles.header}>
        {loc.marketData.tokenContract}
      </Label>
      <Touchable style={styles.container} onPress={onPress}>
        <View style={styles.contractLabel}>
          {icon === COPIED_STATE.COPIED ? <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.green400_15 }]} /> : <GradientItemBackground />}
          <NetworkIcon networkName={networkName} size={24} style={styles.networkIcon} />

          {icon === COPIED_STATE.COPIED ? (
            <Label type="boldMonospace" color="green400">
              {loc.marketData.contractAddressCopied}
            </Label>
          ) : (
            <Label type="boldCaption1" color="light100" numberOfLines={1} ellipsizeMode="middle" style={styles.contractAddress}>
              <Label type="regularMonospace" color="light50">
                {contractAddress}
              </Label>
            </Label>
          )}
        </View>
        <View style={styles.icon}>
          {icon === COPIED_STATE.COPIED ? (
            <>
              <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.green400_15 }]} />
              <SvgIcon size={16} entering={ZoomIn} exiting={FadeOut} {...icon} />
            </>
          ) : (
            <>
              <GradientItemBackground />
              <SvgIcon size={16} entering={FadeIn} exiting={FadeOut} {...icon} onPress={onPress} />
            </>
          )}
        </View>
      </Touchable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    flexDirection: 'row',
    gap: 2,
    height: 36,
    overflow: 'hidden',
  },
  contractLabel: {
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
  },
  icon: {
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 16,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    overflow: 'hidden',
    minWidth: 44, 
  },
  contractAddress: { flex: 1, paddingRight: 6 },
  networkIcon: {
    margin: 6,
  },
  header: {
    marginBottom: 10,
  },
});
