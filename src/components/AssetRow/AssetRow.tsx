import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';

import React, { useCallback, useMemo } from 'react';
import { Linking, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { FadeIn } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { LongPressable } from '@/components/LongPress';
import { LongPressOptionItemProps } from '@/components/LongPress/LongPressOptionItem';
import { showToast } from '@/components/Toast';
import { TokenIcon } from '@/components/TokenIcon';
import { Touchable } from '@/components/Touchable';
import { useTokenBalanceConvertedToAppCurrency } from '@/hooks/useAppCurrencyValue';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { WalletType } from '@/onChain/wallets/registry';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useIsHideBalancesEnabled } from '@/realm/settings/useIsHideBalancesEnabled';
import { useTokenPriceChangePercentage } from '@/realm/tokenPrice';
import { RealmToken } from '@/realm/tokens';
import { useTokensGalleryMutations } from '@/realm/tokensGallery';
import { useRealmWalletById } from '@/realm/wallets';
import { Routes } from '@/Routes';
import { EXPLAINER_CONTENT_TYPES } from '@/screens/Explainer';
import { Currency } from '@/screens/Settings/currency';
import { RemoteAsset } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { getPercentageLabel } from '@/utils/formatPercentage';
import { formatTokenAmountFromToken } from '@/utils/formatTokenAmountFromToken';
import { getExplorerIcon } from '@/utils/getExplorerIcon';
import { getWalletName } from '@/utils/getWalletName';
import { isRealmToken } from '@/utils/isRealmToken';

import loc from '/loc';

const PRICE_CHANGE_PLACEHOLDER = '--';

export type AssetRowProps = {
  token: RealmToken | RemoteAsset;
  options?: Partial<{
    hideZeroAmount: boolean;
    networkName: WalletType;
    onPress: () => void;
    priceChange: boolean;
    showAmountInFiat: boolean;
    style: StyleProp<ViewStyle>;
    selected: boolean;
    symbolUnderLabel: boolean;
    tag: JSX.Element;
    testID: string;
    walletId: string;
    readonly?: boolean;
    disableLongPress?: boolean;
  }>;
};

export const AssetRow = ({ token, options = {} }: AssetRowProps) => {
  const { hideZeroAmount, networkName, showAmountInFiat, onPress, style, priceChange, symbolUnderLabel, tag, testID, walletId, selected } = options;
  const wallet = useRealmWalletById(walletId);
  const isNative = token.assetId.includes('slip44:');
  const label = wallet && wallet.nativeTokenLabel && isNative ? getWalletName(wallet.nativeTokenLabel.toLowerCase() as WalletType) : token.metadata.label;
  const { currency } = useAppCurrency();
  const showPriceChangeUnderLabel = priceChange;
  const showSymbolUnderLabel = !showPriceChangeUnderLabel && symbolUnderLabel;

  const tokenAmountFormatted = formatTokenAmountFromToken(token, { compact: true, currency });
  const amount = hideZeroAmount && tokenAmountFormatted === '0' ? '' : `${tokenAmountFormatted}${symbolUnderLabel ? '' : ' ' + token.metadata.symbol}`;
  const balanceDisplay = useBalanceDisplay(amount);
  const { removeTokenFromGallery } = useTokensGalleryMutations();
  const priceChangePct = useTokenPriceChangePercentage({ assetId: token.assetId });

  const content = useMemo(() => {
    const priceChangeLabel = getPercentageLabel(priceChangePct, 2, {
      placeholderColor: 'light50',
      placeholder: PRICE_CHANGE_PLACEHOLDER,
      truncateTrailingZeros: true,
    });
    return (
      <>
        <View style={styles.leftContentContainer} testID="AssetRowContentContainer">
          {(wallet || networkName !== undefined)  && (
            <TokenIcon wallet={wallet} tokenId={token.assetId} tokenSymbol={token.metadata.symbol} networkName={networkName} />
          )}
          <View style={styles.labelAndLabelContainer}>
            <View style={styles.labelContainer}>
              <Label type="boldTitle2" style={styles.label} numberOfLines={1}>
                {label}
              </Label>
              {tag !== null && <View>{tag}</View>}
            </View>
            {showPriceChangeUnderLabel && isRealmToken(token) && (
              <View style={styles.labelContainer} testID="AssetRowContent">
                <Label testID={`PriceChangeLabel-${testID}`} type="regularCaption1" color={priceChangeLabel.color} style={[styles.priceChangeLabel]}>
                  {priceChangeLabel.label}
                </Label>
              </View>
            )}
            {showSymbolUnderLabel && (
              <Label type="regularMonospace" color="light75">
                {token.metadata.symbol}
              </Label>
            )}
          </View>
        </View>
        <View style={styles.rightContentContainer}>
          {showAmountInFiat && <AssetRowAmountInFiat currency={currency} token={token} />}
          {}
          <Label
            type={showSymbolUnderLabel ? 'boldMonospace' : 'regularMonospace'}
            color={showSymbolUnderLabel ? 'light100' : 'light50'}
            style={[styles.amount, showSymbolUnderLabel && { fontSize: 15 }]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {balanceDisplay}
          </Label>
        </View>
      </>
    );
  }, [
    balanceDisplay,
    priceChangePct,
    currency,
    label,
    networkName,
    showAmountInFiat,
    showPriceChangeUnderLabel,
    showSymbolUnderLabel,
    tag,
    testID,
    token,
    wallet,
  ]);

  const containerStyle = useMemo(() => [style, styles.container], [style]);

  const navigation = useNavigation();
  const longPressOptions = useMemo(() => {
    if (!isRealmToken(token)) {
      return [];
    }
    const { metadata } = token;
    const explorer = metadata?.explorers && metadata.explorers.length > 0 && metadata.explorers[0];
    const data: (LongPressOptionItemProps | undefined | false)[] = [
      {
        text: loc.assetOptions.viewDetails,
        iconName: 'asset-coin',
        onPress: onPress,
      },
      wallet && {
        text: loc.assetOptions.send,
        iconName: 'send',
        onPress: () => {
          navigation.navigate(Routes.SendStack, { screen: 'Send', params: { assetBalanceId: { assetId: token.assetId, walletId: wallet.id } } });
        },
      },
      wallet && {
        text: loc.assetOptions.receive,
        iconName: 'receive',
        onPress: () => {
          navigation.navigate(Routes.Receive, { assetBalanceId: { assetId: token.assetId, walletId: wallet.id } });
        },
        spaceBelow: true,
      },
      !!metadata?.tokenAddress && {
        text: loc.assetOptions.copyContractAddress,
        iconName: 'copy',
        onPress: () => {
          showToast({ type: 'success', text: loc.assetOptions.copied });
          Clipboard.setString(metadata.tokenAddress as string);
          navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.CONTRACT_ADDRESS });
        },
      },
      explorer && {
        text: loc.formatString(loc.assetOptions.viewOn, { explorer: explorer.name }),
        iconName: getExplorerIcon(explorer.name),
        onPress: () => Linking.openURL(explorer.url),
        spaceBelow: true,
      },
      {
        text: loc.assetOptions.hideAsset,
        iconName: 'eye-off',
        onPress: () => removeTokenFromGallery(token),
      },
    ];
    return data.filter(o => !!o);
  }, [removeTokenFromGallery, navigation, onPress, token, wallet]);

  const renderTouchableElement = useCallback(
    () => (
      <Touchable disabled={options.readonly} onPress={onPress} style={containerStyle} accessibilityLabel="CoinRowLabel" testID={testID}>
        {selected && <GradientItemBackground backgroundType="modal" />}
        {content}
      </Touchable>
    ),
    [containerStyle, content, onPress, options.readonly, selected, testID],
  );

  if (onPress) {
    if (!options?.disableLongPress) {
      return (
        <LongPressable options={longPressOptions} style={styles.longPress}>
          {renderTouchableElement()}
        </LongPressable>
      );
    }
    return renderTouchableElement();
  }
  return (
    <View style={containerStyle} testID={testID}>
      {content}
    </View>
  );
};

const AssetRowAmountInFiat = ({ currency, token }: Pick<AssetRowProps, 'token'> & { currency: Currency }) => {
  const amountInAppCurrency = useTokenBalanceConvertedToAppCurrency(token);
  const balancesHidden = useIsHideBalancesEnabled();
  const amountFormatted = useBalanceDisplay(formatCurrency(amountInAppCurrency, { currency }), 7);
  return (
    <Label
      entering={FadeIn}
      style={[styles.animatedNumbers, balancesHidden && styles.balanceHidden]}
      type="boldLargeMonospace"
      color={balancesHidden ? 'light50' : 'light100'}>
      {amountFormatted}
    </Label>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: 52,
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingVertical: 6,
  },
  leftContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  rightContentContainer: {
    paddingLeft: 10,
  },
  labelAndLabelContainer: {
    marginLeft: 12,
    flexShrink: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  label: {
    marginRight: 8,
  },
  amountInFiat: {
    alignItems: 'flex-end',
  },
  animatedNumbers: {
    alignItems: 'flex-end',
    textAlign: 'right',
    minWidth: 100,
  },
  priceChangeLabel: {
    alignItems: 'flex-start',
    textAlign: 'left',
    minWidth: 100,
  },
  amount: {
    textAlign: 'right',
    marginTop: 4,
  },
  balanceHidden: { paddingTop: 5, marginBottom: -5 },
  longPress: { marginHorizontal: 14, flex: 1 },
});
