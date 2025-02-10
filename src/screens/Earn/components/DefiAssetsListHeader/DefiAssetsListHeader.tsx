import { Platform, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Svg } from 'react-native-svg';

import { Label } from '@/components/Label';
import { NetworkFilter } from '@/components/NetworkFilter';
import { NETWORK_FILTER } from '@/components/NetworkFilter/types';

import { useAssetsListWithNetworkFilterContext } from '../../context/AssetsListWithNetworkFilterContext';
import { Sizes } from '../../EarnScreen.constants';
import { DefiAssetsListHeaderSkeleton } from '../EarnScreenSkeleton/EarnScreenSkeleton';

import AndroidHeaderBackgroundSvg from './images/androidHeaderBackground.svg';
import IOSHeaderBackgroundSvg from './images/iosHeaderBackground.svg';

import type { DefiAssetsListHeaderProps } from './DefiAssetsListHeader.types';

import loc from '/loc';

const SUPPORTED_NETWORKS = [NETWORK_FILTER.ethereum, NETWORK_FILTER.polygon, NETWORK_FILTER.arbitrum, NETWORK_FILTER.optimism, NETWORK_FILTER.base];

export const DefiAssetsListHeader: React.FC<DefiAssetsListHeaderProps> = ({ showStickyHeader }) => {
  const { networkFilter, setNetworkFilter, showLoadingStateOnHeader } = useAssetsListWithNetworkFilterContext();

  const stickyHeaderContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(showStickyHeader.value ? 1 : 0, { duration: 300 }),
    };
  });

  if (showLoadingStateOnHeader) {
    return <DefiAssetsListHeaderSkeleton />;
  }

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.stickyHeader, stickyHeaderContainerStyle]}>
        <Svg viewBox="0 0 885 203">{Platform.OS === 'ios' ? <IOSHeaderBackgroundSvg /> : <AndroidHeaderBackgroundSvg />}</Svg>
      </Animated.View>

      <Label type="boldTitle1" style={styles.label}>
        {loc.earn.allAssets}
      </Label>

      <NetworkFilter networkFilter={networkFilter} setNetworkFilter={setNetworkFilter} withBtcAndDoge={false} dataToFilter={SUPPORTED_NETWORKS} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    gap: 16,
    position: 'relative',
    paddingVertical: 12,
  },
  label: {
    paddingHorizontal: Sizes.Space.s2,
  },
  stickyHeader: {
    marginTop: -2,
  },
});
