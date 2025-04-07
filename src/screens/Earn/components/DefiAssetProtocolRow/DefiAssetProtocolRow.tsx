import type React from 'react';

import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';

import { useAppCurrency } from '@/realm/settings';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';
import { Routes } from '@/Routes';
import { formatCurrency } from '@/utils/formatCurrency';

import type { DefiAssetProtocolRowProps } from './DefiAssetProtocolRow.types';

import loc from '/loc';

export const DefiAssetProtocolRow: React.FC<DefiAssetProtocolRowProps> = ({ protocol, isFirst, isLast, closeEarnSheet }) => {
  const { currency } = useAppCurrency();
  const navigation = useNavigation();

  const usdFiatRate = useCurrentUsdFiatRate();
  const valueInUserCurrency = usdFiatRate * protocol.tvlInUsd;
  const formattedTvl = formatCurrency(valueInUserCurrency, { currency, compact: true, hideDecimals: true });

  const onSelectProtocol = useCallback(() => {
    navigation.navigate(Routes.DefiDetails, {
      assetId: protocol.assetId,
      protocolLogo: protocol.protocolLogo,
      vaultAddress: protocol.vaultAddress,
      vaultNetwork: protocol.vaultNetwork,
    });
    closeEarnSheet();
  }, [closeEarnSheet, navigation, protocol]);

  return (
    <Touchable style={styles.protocolItem} onPress={onSelectProtocol}>
      <GradientItemBackground backgroundType="modal" style={[isFirst && styles.firstRow, isLast && styles.lastRow]} />

      <View style={styles.protocolInfoContainer}>
        <Image source={{ uri: protocol.protocolLogo }} style={styles.protocolIcon} />
        <View style={styles.protocolInfo}>
          <Label type="boldTitle2" numberOfLines={1}>
            {protocol.name}
          </Label>
          <Label type="regularMonospace" color="light50">
            {loc.formatString(loc.earn.earnSheet.tvl, { tvl: formattedTvl })}
          </Label>
        </View>
      </View>

      <View style={styles.apyView}>
        <Label type="boldCaption1" color="green400" boldType="boldTitleEarnPercentage">
          {`<b>${protocol.apy}%</b> ${loc.earn.earnSheet.apy}`}
        </Label>
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  firstRow: {
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
  },
  lastRow: {
    borderBottomStartRadius: 16,
    borderBottomEndRadius: 16,
  },
  protocolItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  protocolIcon: {
    height: 40,
    width: 40,
    borderRadius: 7.5,
  },
  protocolInfoContainer: {
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  protocolInfo: {
    gap: 2,
  },
  apyView: {
    gap: 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  apyLabel: {
    marginBottom: 2,
  },
});
