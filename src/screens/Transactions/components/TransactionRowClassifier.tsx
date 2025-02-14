import React, { useEffect } from 'react';

import { useTokenById } from '@/realm/tokens';
import type { TransactionData } from '@/realm/transactions/getTransactionMetadata';
import { useShouldFilterOutTransactionByReputation } from '@/realm/transactions/useShouldFilterOutTransactionByReputation';

import { ContractInteractionRow } from './ContractInteractionRow';
import { SimpleTransactionRow } from './SimpleTransactionRow';
import { SwapTransactionRow } from './SwapTransactionRow';
import { TransactionNftRow } from './TransactionNftRow';

import type { TransactionRowCommonProps } from './types';

export interface TransactionRowClassifierProps extends TransactionRowCommonProps {
  classifiedTx: TransactionData;
  contextTokenId?: string;
  filterInUnverifiedAssets: boolean;
  filterInBlacklistedAssets: boolean;
  onTransactionHide: (txId: string) => void;
}
const TransactionRowClassifier = React.memo(
  ({ classifiedTx, contextTokenId, filterInBlacklistedAssets, filterInUnverifiedAssets, onTransactionHide, ...props }: TransactionRowClassifierProps) => {
    const shouldFilterOutByReputation = useShouldFilterOutTransactionByReputation(classifiedTx, filterInUnverifiedAssets, filterInBlacklistedAssets);
    const contextToken = useTokenById(contextTokenId);

    useEffect(() => {
      if (shouldFilterOutByReputation) {
        onTransactionHide(props.item.id);
      }
    }, [onTransactionHide, props.item.id, shouldFilterOutByReputation]);

    if (shouldFilterOutByReputation) {
      return null;
    }

    switch (classifiedTx.kind) {
      case 'simple':
        return <SimpleTransactionRow classifiedTx={classifiedTx} contextToken={contextToken} testID={`Simple-${classifiedTx.type}`} {...props} />;
      case 'contract':
        return <ContractInteractionRow classifiedTx={classifiedTx} contextToken={contextToken} testID="ContractInteraction" {...props} />;
      case 'swap':
        return <SwapTransactionRow classifiedTx={classifiedTx} contextToken={contextToken} testID="Swap" {...props} />;
      case 'nft':
        return (
          <TransactionNftRow
            filterInSpam={filterInBlacklistedAssets}
            classifiedTx={classifiedTx}
            contextToken={contextToken}
            testID={`Nft-${classifiedTx.type}`}
            onTransactionHide={onTransactionHide}
            {...props}
          />
        );
      default:
        return null;
    }
  },
);

export { TransactionRowClassifier };
