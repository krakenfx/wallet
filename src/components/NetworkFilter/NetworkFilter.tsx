import type { ReactElement } from 'react';

import type React from 'react';

import { compact } from 'lodash';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';

import { Label } from '@/components/Label';
import { NetworkIcon } from '@/components/NetworkIcon';
import { Pill } from '@/components/Pill';

import { Touchable } from '@/components/Touchable';
import { useLocalStateUpdate } from '@/hooks/useLocalStateUpdate';
import { FeatureFlag, NEW_NETWORKS, useFeatureFlagEnabled } from '@/utils/featureFlags';

import { getNetworkFilters } from './getNetworkFilters';

import { NETWORK_FILTER } from './types';

import type { UINetworkFilter } from './types';

import loc from '/loc';

export type UIFilterData = {
  uiLabel: () => string;
  icon: ReactElement | null;
  networkFilter: UINetworkFilter;
};

const UI_FILTER_DATA_MAP: Record<UINetworkFilter, UIFilterData> = {
  all: {
    uiLabel: () => loc.coins.allNetworks,
    icon: null,
    networkFilter: 'all',
  },
  [NETWORK_FILTER.ethereum]: {
    uiLabel: () => loc.network.ethereum,
    icon: <NetworkIcon networkName="ethereum" size={16} />,
    networkFilter: NETWORK_FILTER.ethereum,
  },
  [NETWORK_FILTER.polygon]: {
    uiLabel: () => loc.network.polygon,
    icon: <NetworkIcon networkName="polygon" size={16} />,
    networkFilter: NETWORK_FILTER.polygon,
  },
  [NETWORK_FILTER.arbitrum]: {
    uiLabel: () => loc.network.arbitrum,
    icon: <NetworkIcon networkName="arbitrum" size={16} />,
    networkFilter: NETWORK_FILTER.arbitrum,
  },
  [NETWORK_FILTER.optimism]: {
    uiLabel: () => loc.network.optimism,
    icon: <NetworkIcon networkName="optimism" size={16} />,
    networkFilter: NETWORK_FILTER.optimism,
  },
  [NETWORK_FILTER.base]: {
    uiLabel: () => loc.network.base,
    icon: <NetworkIcon networkName="base" size={16} />,
    networkFilter: NETWORK_FILTER.base,
  },
  [NETWORK_FILTER.blast]: {
    uiLabel: () => loc.network.blast,
    icon: <NetworkIcon networkName="blast" size={16} />,
    networkFilter: NETWORK_FILTER.blast,
  },
  [NETWORK_FILTER.solana]: {
    uiLabel: () => loc.network.solana,
    icon: <NetworkIcon networkName="solana" size={16} />,
    networkFilter: NETWORK_FILTER.solana,
  },
  [NETWORK_FILTER.linea]: {
    uiLabel: () => loc.network.linea,
    icon: <NetworkIcon networkName="linea" size={16} />,
    networkFilter: NETWORK_FILTER.linea,
  },
  [NETWORK_FILTER.avalanche]: {
    uiLabel: () => loc.network.avalanche,
    icon: <NetworkIcon networkName="avalanche" size={16} />,
    networkFilter: NETWORK_FILTER.avalanche,
  },
  [NETWORK_FILTER.HDsegwitBech32]: {
    uiLabel: () => loc.network.bitcoin,
    icon: <NetworkIcon networkName="HDsegwitBech32" size={16} />,
    networkFilter: NETWORK_FILTER.HDsegwitBech32,
  },
  [NETWORK_FILTER.doge]: {
    uiLabel: () => loc.network.dogecoin,
    icon: <NetworkIcon networkName="dogecoin" size={16} />,
    networkFilter: NETWORK_FILTER.doge,
  },
};

export const DEFAULT_ORDERED_NETWORK_FILTERS: UINetworkFilter[] = [
  'all',
  NETWORK_FILTER.ethereum,
  NETWORK_FILTER.polygon,
  NETWORK_FILTER.arbitrum,
  NETWORK_FILTER.optimism,
  NETWORK_FILTER.base,
  NETWORK_FILTER.blast,
  NETWORK_FILTER.solana,
  NETWORK_FILTER.linea,
  NETWORK_FILTER.avalanche,
];

type Props = {
  networkFilter: NETWORK_FILTER[];
  setNetworkFilter: React.Dispatch<React.SetStateAction<NETWORK_FILTER[]>>;
  withBtcAndDoge?: boolean;
  dataToFilter?: UINetworkFilter[];
};

export const isNewNetworkFilter = (filter: UINetworkFilter) => NEW_NETWORKS.some(network => filter.includes(network));

export const NetworkFilter = ({ networkFilter, setNetworkFilter, withBtcAndDoge, dataToFilter }: Props) => {
  const isNewNetworksEnabled = useFeatureFlagEnabled(FeatureFlag.NewNetworksEnabled);

  const uiFilterData = useMemo<UIFilterData[]>(() => {
    let filters = dataToFilter ?? DEFAULT_ORDERED_NETWORK_FILTERS;
    if (!isNewNetworksEnabled) {
      filters = filters.filter(f => !isNewNetworkFilter(f));
    }
    if (withBtcAndDoge) {
      filters = [...filters, NETWORK_FILTER.HDsegwitBech32, NETWORK_FILTER.doge];
    }
    return compact(filters.map(f => UI_FILTER_DATA_MAP[f]));
  }, [dataToFilter, isNewNetworksEnabled, withBtcAndDoge]);

  const [localFilter, updateFilter] = useLocalStateUpdate(networkFilter, setNetworkFilter);

  const onPress = (d: UIFilterData) => {
    const filter = getNetworkFilters(d.networkFilter, localFilter);
    updateFilter(filter);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      horizontal
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}>
      {uiFilterData.map((d, i) => {
        const isSelected = d.networkFilter === 'all' ? localFilter.length === 0 : localFilter.includes(d.networkFilter);
        return (
          <Touchable onPress={() => onPress(d)} key={d.networkFilter + i}>
            <Pill backgroundColor={isSelected ? 'light8' : 'dark15'}>
              {d.icon}
              <Label color="light100" type="boldCaption1" style={styles.label}>
                {d.uiLabel()}
              </Label>
            </Pill>
          </Touchable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 60,
  },
  contentContainer: {
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  label: {
    lineHeight: 16,
  },
});
