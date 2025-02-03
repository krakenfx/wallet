import type { StyleProp, ViewStyle } from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';

import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AssetAvailableBalance } from '@/components/AssetRow/AssetAvailableBalance';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useBrowser } from '@/hooks/useBrowser';
import type { WalletType } from '@/onChain/wallets/registry';
import type { KrakenAssetSupported } from '@/reactQuery/hooks/krakenConnect/types';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import type { RealmToken } from '@/realm/tokens';
import { useTokensGalleryMutations } from '@/realm/tokensGallery';
import { type RealmWallet, useRealmWalletById } from '@/realm/wallets';
import { Routes } from '@/Routes';
import { EXPLAINER_CONTENT_TYPES } from '@/screens/Explainer';
import type { RemoteAsset } from '@/types';
import { formatTokenAmountFromToken } from '@/utils/formatTokenAmountFromToken';
import { getExplorerIcon } from '@/utils/getExplorerIcon';
import { getWalletName } from '@/utils/getWalletName';
import { isKrakenExchangeAsset } from '@/utils/isKrakenExchangeAsset';
import { isRealmToken } from '@/utils/isRealmToken';

import { GradientItemBackground } from '../GradientItemBackground';
import { Label } from '../Label';
import { LongPressable } from '../LongPress';

import { showToast } from '../Toast';
import { TokenIcon } from '../TokenIcon';
import { Touchable } from '../Touchable';

import { AssetPriceChangeLabel } from './AssetPriceChangeLabel';
import { AssetRowAmountInFiat } from './AssetRowAmountInFiat';

import type { LongPressOptionItemProps } from '../LongPress/LongPressOptionItem';

import loc from '/loc';

export type AssetRowProps = {
  token: RealmToken | RemoteAsset | KrakenAssetSupported;
  options?: Partial<{
    hideZeroAmount: boolean;
    hideZeroAmountFiat: boolean;
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
    forceOmitNetworkIcon?: boolean;
  }>;
};

const getAssetLabel = (wallet: RealmWallet | undefined, token: RealmToken | RemoteAsset | KrakenAssetSupported, isNative: boolean) => {
  if (wallet && wallet.nativeTokenLabel && isNative) {
    try {
      return getWalletName(wallet.nativeTokenLabel.toLowerCase() as WalletType);
    } catch (error) {
      return wallet.nativeTokenLabel;
    }
  }
  return token.metadata.label;
};

export const AssetRow = ({ token, options = {} }: AssetRowProps) => {
  const {
    hideZeroAmount,
    networkName,
    showAmountInFiat,
    onPress,
    style,
    priceChange,
    symbolUnderLabel,
    tag,
    testID,
    walletId,
    selected,
    disableLongPress,
    forceOmitNetworkIcon,
  } = options;
  const wallet = useRealmWalletById(walletId);
  const isNative = token.assetId.includes('slip44:');
  const label = getAssetLabel(wallet, token, isNative);
  const { currency } = useAppCurrency();
  const showPriceChangeUnderLabel = priceChange;
  const showSymbolUnderLabel = !showPriceChangeUnderLabel && symbolUnderLabel;

  const tokenAmountFormatted = formatTokenAmountFromToken(token, { compact: true, currency });
  const amount = hideZeroAmount && tokenAmountFormatted === '0' ? '' : `${tokenAmountFormatted}${symbolUnderLabel ? '' : ' ' + token.metadata.symbol}`;
  const balanceDisplay = useBalanceDisplay(amount);
  const { removeTokenFromGallery } = useTokensGalleryMutations();
  const { openURL } = useBrowser();

  const content = useMemo(() => {
    return (
      <>
        <View style={styles.leftContentContainer} testID="AssetRowContentContainer">
          {(wallet || networkName !== undefined) && (
            <TokenIcon
              wallet={wallet}
              tokenId={token.assetId}
              tokenSymbol={token.metadata.symbol}
              networkName={networkName}
              forceOmitNetworkIcon={forceOmitNetworkIcon}
            />
          )}
          <View style={styles.labelAndLabelContainer}>
            <View style={styles.labelContainer}>
              <Label type="boldTitle2" style={styles.label} numberOfLines={1}>
                {label}
              </Label>
              {tag !== null && <View>{tag}</View>}
            </View>
            {showPriceChangeUnderLabel && isRealmToken(token) && <AssetPriceChangeLabel assetId={token.assetId} testID={testID} />}
            {isKrakenExchangeAsset(token) && !showPriceChangeUnderLabel && <AssetAvailableBalance asset={token} />}
            {showSymbolUnderLabel && (
              <Label type="regularMonospace" color="light75">
                {token.metadata.symbol}
              </Label>
            )}
          </View>
        </View>
        <View style={styles.rightContentContainer}>
          {showAmountInFiat && <AssetRowAmountInFiat currency={currency} token={token} options={options} />}
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceDisplay, currency, label, networkName, showAmountInFiat, showPriceChangeUnderLabel, showSymbolUnderLabel, tag, testID, token, wallet]);

  const containerStyle = useMemo(() => [style, styles.container], [style]);

  const navigation = useNavigation();
  const longPressOptions = useMemo(
    () => {
      if (!isRealmToken(token) || disableLongPress) {
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
          onPress: () => openURL(explorer.url),
          spaceBelow: true,
        },
        {
          text: loc.assetOptions.hideAsset,
          iconName: 'eye-off',
          onPress: () => removeTokenFromGallery(token),
        },
      ];
      return data.filter(o => !!o);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [removeTokenFromGallery, navigation, onPress, token, wallet],
  );

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
  priceChangeLabel: {
    alignItems: 'flex-start',
    textAlign: 'left',
    minWidth: 100,
  },
  amount: {
    textAlign: 'right',
    marginTop: 4,
  },
  longPress: {
    marginHorizontal: 14,
    flex: 1,
  },
});
