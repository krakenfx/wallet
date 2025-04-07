import type React from 'react';

import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import Animated from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';

import { TokenIcon } from '@/components/TokenIcon';
import { useAssetMetadata } from '@/realm/assetMetadata';
import { useAppCurrency } from '@/realm/settings';
import { useTokenByAssetId } from '@/realm/tokens';
import { useWalletByAssetId } from '@/realm/wallets/useWalletByAssetId';
import { Routes } from '@/Routes';
import { useTheme } from '@/theme/themes';
import { formatTokenAmountFromToken } from '@/utils/formatTokenAmountFromToken';

import { useSheetHeaderAnimation } from './useSheetHeaderAnimation';

import type { DefiEarnSheetHeaderProps } from './DefiEarnSheetHeader.types';

import loc from '/loc';

export const DefiEarnSheetHeader: React.FC<DefiEarnSheetHeaderProps> = ({ assetId, isHeaderShrunk, closeEarnSheet }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const metadata = useAssetMetadata({ assetId });
  const wallet = useWalletByAssetId(assetId);
  const token = useTokenByAssetId(assetId, wallet.id);
  const { currency } = useAppCurrency();
  const tokenAmountFormatted = token ? formatTokenAmountFromToken(token, { compact: true, currency }) : '0';

  const onSwap = () => {
    closeEarnSheet();
    navigation.navigate(Routes.Swap, { targetTokenId: assetId });
  };

  const { headerStyle, tokenIconStyle, copyStyle, onLayout } = useSheetHeaderAnimation({ tokenAmountFormatted, isHeaderShrunk });

  return (
    <Animated.View onLayout={onLayout} style={[styles.container, headerStyle]} testID="DefiEarnSheetHeader">
      <Animated.View style={tokenIconStyle}>
        <TokenIcon size={80} tokenId={assetId} tokenSymbol={metadata?.symbol} wallet={wallet} />
      </Animated.View>
      <Animated.View style={[styles.copy, copyStyle]}>
        <Label type="boldDisplay4">{loc.formatString(loc.earn.earnSheet.earn, { symbol: metadata?.symbol || '' })}</Label>

        {tokenAmountFormatted !== '0' ? (
          <Label type="regularBody" color="light50">
            {loc.formatString(loc.earn.earnSheet.amountAvailable, { balance: tokenAmountFormatted, symbol: metadata?.symbol || '' })}
          </Label>
        ) : (
          <Animated.View style={[styles.noAssetsHoldView, { backgroundColor: colors.dark15 }]}>
            <Label type="regularCaption1" color="light50" style={styles.noBalanaceFoundText}>
              {loc.formatString(loc.earn.earnSheet.noBalanaceFound, { symbol: metadata?.symbol || '' })}
            </Label>

            <Button style={styles.swapButton} iconSize={16} color="kraken" textType="boldBody" icon="swap" text={loc.earn.earnSheet.swapCta} onPress={onSwap} />
          </Animated.View>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    gap: 16,
    alignItems: 'center',
    height: 'auto',
  },
  noBalanaceFoundText: {
    flex: 1,
  },
  copy: {
    flex: 1,
    gap: 2,
    alignItems: 'center',
  },
  noAssetsHoldView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 12,
    borderRadius: 16,
    marginTop: 16,
  },
  swapButton: {
    height: 38,
  },
});
