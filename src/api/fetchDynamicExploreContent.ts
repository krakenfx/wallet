import type { WalletData } from '@/onChain/wallets/base';
import { ethereumNetwork } from '@/onChain/wallets/evmNetworks';
import { ChainAgnostic } from '@/onChain/wallets/utils/ChainAgnostic';
import { isValidContentRow } from '@/screens/Explore/utils/isValidExploreContent';

import { getHarmony } from './base/apiFactory';

import type { ExploreContentRow } from './types';

import { handleError } from '/helpers/errorHandler';

export async function fetchDynamicExploreContent(contentId: string, wallet: WalletData): Promise<ExploreContentRow> {
  const harmony = await getHarmony();
  const address = await ethereumNetwork.deriveAddress(wallet);

  try {
    const { content } = await harmony.GET('/v1/explore/content/{contentId}', {
      params: {
        path: {
          contentId: contentId,
        },
        query: {
          address,
          network: ChainAgnostic.NETWORK_ETHEREUM,
        },
      },
    });

    if (!isValidContentRow(content)) {
      throw new Error('invalid explore content data');
    }

    return content;
  } catch (err) {
    handleError(err, 'ERROR_CONTEXT_PLACEHOLDER', 'generic');
    throw new Error('Error fetching dynamic explore content');
  }
}
