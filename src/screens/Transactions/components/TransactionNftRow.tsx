import React, { useCallback, useEffect, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Transaction } from '@/api/types';
import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import { TokenIconFallback } from '@/components/TokenIcon';
import { Touchable } from '@/components/Touchable';
import { useNftMetadata } from '@/realm/nftMetadata';

import { RealmToken, useTokenByAssetId } from '@/realm/tokens';
import { RealmTransaction, usePendingTransactionById } from '@/realm/transactions';
import { TRANSACTION_TYPES } from '@/realm/transactions/const';
import { NFTTransactionData, getTransactionTitle } from '@/realm/transactions/getTransactionMetadata';
import { NavigationProps, Routes } from '@/Routes';
import { TRANSACTIONS_REALM_QUEUE_KEY } from '@/screens/Transactions/utils/types';

import { formatTransactionAddress } from '../utils/formatAddress';
import { useNftAmounts } from '../utils/useNftAmounts';

const IMG_SIZE = 40;
const NFT_IMAGE = 'NFT';

export type TransactionNftRowProps = {
  item: RealmTransaction;
  parsedTx: Transaction;
  classifiedTx: NFTTransactionData;
  contextToken?: RealmToken;
  navigation: NavigationProps<'Transactions' | 'GlobalActivity' | 'Home'>['navigation'];
  filterInSpam: boolean;
  testID?: string;
  onTransactionHide: (txId: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
};
export const TransactionNftRow = React.memo(
  ({
    item,
    parsedTx,
    classifiedTx,
    navigation,
    testID,
    contextToken: contextToken_,
    filterInSpam,
    onTransactionHide,
    containerStyle,
  }: TransactionNftRowProps) => {
    let finalNftAssetId = classifiedTx.nft.assetId;
    if (finalNftAssetId.endsWith('?nft')) {
      finalNftAssetId = finalNftAssetId.slice(0, -4);
    }

    const isGlobalView = !contextToken_;

    const nftAssetMetadata = useNftMetadata({ assetId: finalNftAssetId, wallet: item.wallet, realmQueueName: TRANSACTIONS_REALM_QUEUE_KEY });
    const contextGlobalToken_ = useTokenByAssetId(classifiedTx.paymentToken?.assetId ?? '', item.walletId);

    const contextToken = contextToken_ || contextGlobalToken_;

    const shouldFilterOut = nftAssetMetadata?.isSpam && !filterInSpam;

    useEffect(() => {
      if (shouldFilterOut) {
        onTransactionHide(item.id);
      }
    }, [item.id, onTransactionHide, shouldFilterOut]);

    const pendingTx = usePendingTransactionById(item.id);

    const { assetAmountFormatted, assetAmountInCurrencyFormatted, assetAmountAndNetworkFeeFormatted, assetAmountAndNetworkFeeInCurrencyFormatted } =
      useNftAmounts(classifiedTx, item, contextToken, isGlobalView);

    const descriptionDefault = parsedTx.protocolInfo?.projectId || formatTransactionAddress(parsedTx.metadata?.target, classifiedTx.type ?? '');

    const NFTname = useMemo(() => {
      return nftAssetMetadata?.name ?? nftAssetMetadata?.description;
    }, [nftAssetMetadata]);

    const description = useMemo(() => {
      if (classifiedTx.type === TRANSACTION_TYPES.NFT_MINT) {
        return formatTransactionAddress(nftAssetMetadata?.collectionId ?? '', TRANSACTION_TYPES.NFT_MINT);
      }
      return descriptionDefault;
    }, [classifiedTx, nftAssetMetadata, descriptionDefault]);

    const title = getTransactionTitle(classifiedTx.type);

    const symbol = useMemo(() => {
      if (classifiedTx.type === TRANSACTION_TYPES.NFT_RECEIVE) {
        return '';
      }
      return contextToken?.metadata.symbol || '';
    }, [contextToken, classifiedTx]);

    const transactionDetailsMetadata = useMemo(() => {
      return {
        logo: nftAssetMetadata?.imageUrl ?? '',
        title,
        description: description,
        networkFee: item.fee,
        appCurrencyValue: assetAmountInCurrencyFormatted,
        tokenAmount: assetAmountFormatted,
        symbol: symbol,
        transactionType: classifiedTx.type,
        nftMetadata: nftAssetMetadata,
      };
    }, [classifiedTx.type, item.fee, nftAssetMetadata, title, description, symbol, assetAmountFormatted, assetAmountInCurrencyFormatted]);

    const openTransactionDetails = useCallback(() => {
      navigation.navigate(Routes.TransactionDetails, {
        assetId: contextToken?.assetId,
        id: item.id,
        transactionDetailsData: transactionDetailsMetadata,
      });
    }, [item, navigation, contextToken?.assetId, transactionDetailsMetadata]);

    const showRow = !(pendingTx !== undefined && pendingTx.isValid() && !pendingTx.confirmed);

    const hideAmount = useMemo(
      () => isGlobalView && ![TRANSACTION_TYPES.NFT_BUY, TRANSACTION_TYPES.NFT_SELL].includes(classifiedTx.type),
      [classifiedTx.type, isGlobalView],
    );

    if (shouldFilterOut) {
      return null;
    }

    const nftTitle = `${title} ${NFTname ? `(${NFTname})` : ''}`;

    return (
      <View>
        {showRow && (
          <Touchable onPress={openTransactionDetails}>
            <View style={[styles.container, containerStyle]} testID={testID}>
              <View style={styles.startContainer}>
                {!nftAssetMetadata?.imageUrl ? (
                  <TokenIconFallback size={IMG_SIZE} tokenSymbol={NFT_IMAGE} style={styles.image} />
                ) : (
                  <ImageSvg width={IMG_SIZE} height={IMG_SIZE} style={styles.image} uri={nftAssetMetadata?.imageUrl} />
                )}

                <View style={styles.column}>
                  <Label type="boldBody" numberOfLines={1}>
                    {nftTitle}
                  </Label>

                  <Label type="regularCaption1" color="light50">
                    {description}
                  </Label>
                </View>
              </View>
              <View style={styles.spacer} />
              {!hideAmount && (
                <View style={styles.endContainer}>
                  <Label style={styles.text} type="boldBody" numberOfLines={1}>
                    {assetAmountAndNetworkFeeInCurrencyFormatted}
                  </Label>

                  <Label style={styles.text} type="regularCaption1" numberOfLines={1} color="light50">
                    {`${assetAmountAndNetworkFeeFormatted} ${symbol}`}
                  </Label>
                </View>
              )}
            </View>
          </Touchable>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  image: {
    borderRadius: 24,
    marginRight: 12,
    alignSelf: 'flex-end',
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingVertical: 6,
    height: 56,
  },
  startContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },
  endContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    maxWidth: '45%',
  },
  text: {
    flexShrink: 1,
  },
  column: {
    marginRight: 24,
  },
  spacer: {
    flex: 1,
  },
  verticalSpace: {
    marginVertical: 3,
  },
});

export default TransactionNftRow;
