import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import { MaskedElementWithCoin } from '@/components/MaskedElementWithCoin';
import type { WalletType } from '@/onChain/wallets/registry';

interface Props {
  coinType?: WalletType;
  maskedElementUrl?: string | null;
  title?: string;
  subtitle?: string;
}

export const HeaderNavigationTitle = memo(({ coinType, maskedElementUrl, title, subtitle }: Props) => {
  return (
    <View style={styles.headerTitle}>
      {maskedElementUrl && coinType && (
        <MaskedElementWithCoin
          maskedElement={<ImageSvg uri={maskedElementUrl} width={32} height={32} />}
          coinType={coinType}
          size={32}
          coinSize={16}
          style={styles.headerIcon}
        />
      )}
      <View style={styles.headerLabel}>
        {!!title && (
          <Label type="boldTitle2" numberOfLines={1}>
            {title}
          </Label>
        )}
        {!!subtitle && (
          <Label type="regularCaption1" color="light75" numberOfLines={1}>
            {subtitle}
          </Label>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerLabel: {
    justifyContent: 'center',
    flexBasis: '70%', 
  },
  headerIcon: {
    marginRight: 8,
    marginLeft: 4,
  },
});
