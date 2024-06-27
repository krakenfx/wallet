import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { FadeIn } from 'react-native-reanimated';

import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import { MaskedElementWithCoin } from '@/components/MaskedElementWithCoin';
import { Touchable } from '@/components/Touchable';
import { parseDefiNetworkTypeToWalletType } from '@/onChain/wallets/registry';
import { RealmDefi } from '@/realm/defi';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';
import { formatCurrency } from '@/utils/formatCurrency';

import loc from '/loc';

const IMG_SIZE = 40;

interface Props {
  item: RealmDefi;
  onPress: () => void;
}
export const DefiRow: FC<Props> = ({ item: { network, protocolImageUrl, protocolName, protocolUsdBalance, products }, onPress }) => {
  const walletType = parseDefiNetworkTypeToWalletType(network);
  const numberOfPositions = products.reduce((sum, defi) => sum + defi.positions.length, 0);
  const positionLabel = numberOfPositions === 1 ? loc.defi.onePosition : loc.formatString(loc.defi.positions, { numberOfPositions });
  const usdFiatRate = useCurrentUsdFiatRate();
  const protocolBalance = usdFiatRate * protocolUsdBalance;
  const { currency } = useAppCurrency();

  return (
    <Touchable onPress={onPress} style={styles.container} accessibilityLabel="DefiRowLabel">
      <View style={styles.leftContentContainer}>
        <MaskedElementWithCoin
          maskedElement={<ImageSvg width={IMG_SIZE} height={IMG_SIZE} uri={protocolImageUrl} />}
          coinType={walletType}
          size={IMG_SIZE}
          coinSize={16}
        />
        <View>
          <Label type="boldTitle2" style={styles.protocolName}>
            {protocolName}
          </Label>
        </View>
      </View>
      <View style={styles.rightContentContainer}>
        <View style={styles.protocolBalanceInFiat}>
          <Label entering={FadeIn} style={styles.numbers} type="boldLargeMonospace">
            {formatCurrency(protocolBalance, { currency })}
          </Label>
        </View>
        <Label type="regularCaption1" color="light50" style={styles.positionLabel}>
          {positionLabel}
        </Label>
      </View>
    </Touchable>
  );
};

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    height: 52,
  },
  leftContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
  },
  protocolName: {
    marginLeft: 10,
    marginRight: 8,
  },
  rightContentContainer: {
    width: '30%',
  },
  protocolBalanceInFiat: {
    textAlign: 'right',
    alignItems: 'flex-end',
  },
  numbers: {
    justifyContent: 'flex-end',
    marginBottom: 4,
    width: '100%',
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  positionLabel: {
    textAlign: 'right',
  },
});
