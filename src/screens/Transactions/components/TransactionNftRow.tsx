import type { StyleProp, ViewStyle } from 'react-native';

import React, { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Transaction } from '@/api/types';
import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import { TokenIconFallback } from '@/components/TokenIcon';
import { Touchable } from '@/components/Touchable';
import { TransactionRow } from '@/components/TransactionRow';
import { useNftMetadata } from '@/realm/nftMetadata';

import type { RealmToken } from '@/realm/tokens';
import { useTokenByAssetId } from '@/realm/tokens';
import type { RealmTransaction } from '@/realm/transactions';
import { usePendingTransactionById } from '@/realm/transactions';
import { TRANSACTION_TYPES } from '@/realm/transactions/const';
import type { NFTTransactionData } from '@/realm/transactions/getTransactionMetadata';
import { getTransactionTitle } from '@/realm/transactions/getTransactionMetadata';
import type { NavigationProps } from '@/Routes';
import { Routes } from '@/Routes';
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
    const paymentToken = useTokenByAssetId(classifiedTx.paymentToken?.assetId ?? '', item.walletId);

    const contextToken = paymentToken || contextToken_;

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

    const nftTitle = `${title} ${NFTname ? `(${NFTname})` : ''}`;

    const icon = useMemo(
      () =>
        !nftAssetMetadata?.imageUrl ? (
          <TokenIconFallback size={IMG_SIZE} tokenSymbol={NFT_IMAGE} style={styles.image} />
        ) : (
          <ImageSvg width={IMG_SIZE} height={IMG_SIZE} style={styles.image} uri={nftAssetMetadata?.imageUrl} />
        ),
      [nftAssetMetadata],
    );
    const title_ = useMemo(
      () => (
        <Label type="boldBody" numberOfLines={1}>
          {nftTitle}
        </Label>
      ),
      [nftTitle],
    );
    const subtitle = useMemo(
      () => (
        <Label type="regularCaption1" color="light50">
          {description}
        </Label>
      ),
      [description],
    );
    const amounts = useMemo(
      () =>
        !hideAmount ? (
          <>
            <Label style={styles.text} type="boldBody" numberOfLines={1}>
              {assetAmountAndNetworkFeeInCurrencyFormatted}
            </Label>

            <Label style={styles.text} type="regularCaption1" numberOfLines={1} color="light50">
              {`${assetAmountAndNetworkFeeFormatted} ${symbol}`}
            </Label>
          </>
        ) : undefined,
      [hideAmount, assetAmountAndNetworkFeeFormatted, assetAmountAndNetworkFeeInCurrencyFormatted, symbol],
    );

    if (shouldFilterOut) {
      return null;
    }

    return (
      <View>
        {showRow && (
          <Touchable onPress={openTransactionDetails}>
            <TransactionRow containerStyle={containerStyle} icon={icon} title={title_} subtitle={subtitle} amounts={amounts} testID={testID} />
          </Touchable>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  image: {
    borderRadius: 24,
    alignSelf: 'flex-end',
    overflow: 'hidden',
  },

  text: {
    flexShrink: 1,
  },
});

export default TransactionNftRow;
