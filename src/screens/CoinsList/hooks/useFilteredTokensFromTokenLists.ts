import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { fetchTokenLists } from '@/api/fetchTokenLists';
import type { NETWORK_FILTER } from '@/components/NetworkFilter/types';
import { useDepsChanged } from '@/hooks/useDepsChanged';
import { TESTNET_COINS, networkIdToNetworkName } from '@/onChain/wallets/registry';
import { RealmSettingsKey } from '@/realm/settings';
import { useSettingsByKey } from '@/realm/settings/useSettingsByKey';
import { useTokensFilteredByReputationAndNetwork } from '@/realm/tokens/useTokensFilteredByReputationAndNetwork';
import type { RemoteAsset } from '@/types';
import { untilFirstBackslash } from '@/utils/stringUtils';

import { adaptTokenFromTokenListsToRemoteAsset } from '../utils/adaptTokenFromTokenListsToRemoteAsset';

import type { TokenFromTokenLists } from '../types';

import { handleError } from '/helpers/errorHandler';

const OMITTED_TOKEN = 'eip155:137/erc20:0x0000000000000000000000000000000000001010';

export const useFilteredTokensFromTokenLists = (networkFilter: NETWORK_FILTER[], searchQuery: string): Record<string, RemoteAsset[]> => {
  const realmTokens = useTokensFilteredByReputationAndNetwork(networkFilter);
  const hasNetworkFilterOrRealmTokensChanged = useDepsChanged([networkFilter, realmTokens.length]);
  const isTestnetEnabled = useSettingsByKey(RealmSettingsKey.isTestnetEnabled);
  const [whitelistedTokens, setWhitelistedTokens] = useState<TokenFromTokenLists[]>([]);
  const [filteredWhitelistedTokens, setFilteredWhitelistedTokens] = useState<Record<string, RemoteAsset[]>>({});

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const response = await fetchTokenLists();
          if ((response?.content?.whitelist || []).length > 0) {
            const whitelist = response?.content?.whitelist ?? [];
            setWhitelistedTokens(whitelist);
          }
        } catch (e) {
          handleError(e, 'ERROR_CONTEXT_PLACEHOLDER');
        }
      })();
    }, []),
  );

  useEffect(
    function filterWhitelistedTokens() {
      const isEmpty = Object.keys(filteredWhitelistedTokens).length === 0;

      if (searchQuery && (hasNetworkFilterOrRealmTokensChanged || isEmpty)) {
        const searchQueryMap: Record<string, RemoteAsset[]> = {};

        const realmAndOmittedTokensMap = realmTokens.reduce((acc: Record<string, string>, cur) => {
          acc[cur.assetId] = '';

          if (cur.assetId.startsWith('solana')) {
            acc[cur.assetId.toLowerCase()] = '';
          }

          return acc;
        }, {});
        realmAndOmittedTokensMap[OMITTED_TOKEN] = '';

        const supportedNetworks = (() => {
          const supportedNetworks_: Record<string, string> = { ...networkIdToNetworkName };

          if (!isTestnetEnabled) {
            Object.entries(supportedNetworks_).forEach(([k, v]) => {
              if (TESTNET_COINS.includes(v as (typeof TESTNET_COINS)[number])) {
                delete supportedNetworks_[k];
              }
            });
          }

          Object.keys(supportedNetworks_).forEach(k => {
            delete supportedNetworks_[k];

            supportedNetworks_[k.toLowerCase()] = '_';
          });

          return supportedNetworks_;
        })();

        whitelistedTokens.forEach(whitelistToken => {
          const networkId = (whitelistToken.caipId.match(untilFirstBackslash) || []).join().toLowerCase();

          if (!(networkId in supportedNetworks)) {
            return;
          }

          if (whitelistToken.caipId in realmAndOmittedTokensMap) {
            return;
          }

          if (networkFilter.length > 0) {
            if (networkFilter.some(f => whitelistToken.caipId.startsWith(f))) {
              const remoteAsset = adaptTokenFromTokenListsToRemoteAsset(whitelistToken);
              addKeysToSearchQueryMap(whitelistToken, remoteAsset, searchQueryMap);
            }

            return;
          }

          const remoteAsset = adaptTokenFromTokenListsToRemoteAsset(whitelistToken);
          addKeysToSearchQueryMap(whitelistToken, remoteAsset, searchQueryMap);
        });
        if (Object.keys(searchQueryMap).length > 0) {
          setFilteredWhitelistedTokens(searchQueryMap);
        }
      }
    },
    [isTestnetEnabled, hasNetworkFilterOrRealmTokensChanged, networkFilter, realmTokens, searchQuery, filteredWhitelistedTokens, whitelistedTokens],
  );

  return filteredWhitelistedTokens;
};

const MAX_KEYS_FROM_TOKEN_NAME = 4;
export function addKeysToSearchQueryMap(
  tokenFromTokenLists: TokenFromTokenLists,
  remoteAsset: RemoteAsset,
  searchQueryMap: Record<string, RemoteAsset[]>,
): void {
  const wasAdded: Record<string, string> = {};
  const keyFromSymbol = (tokenFromTokenLists.symbol ?? '').trim();
  const keysFromName = (tokenFromTokenLists.name ?? '').trim().split(' ').slice(0, MAX_KEYS_FROM_TOKEN_NAME);

  keysFromName.push(keyFromSymbol);

  for (let i = 0, ii = keysFromName.length; i < ii; i++) {
    const key = keysFromName[i];

    if (key === '') {
      return;
    }

    const char = key.charAt(0).toLowerCase();

    if (!(char in wasAdded)) {
      if (char in searchQueryMap) {
        searchQueryMap[char].push(remoteAsset);
      } else {
        searchQueryMap[char] = [remoteAsset];
      }

      wasAdded[char] = '';
    }
  }

  if (keyFromSymbol.charAt(0) === '$') {
    const char = keyFromSymbol.charAt(1).toLowerCase();

    if (char && !(char in wasAdded)) {
      if (char in searchQueryMap) {
        searchQueryMap[char].push(remoteAsset);
      } else {
        searchQueryMap[char] = [remoteAsset];
      }
    }
  }
}
