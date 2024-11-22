import type React from 'react';
import type { AnimatedStyle } from 'react-native-reanimated';

import { type StyleProp, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { DividerLine } from '@/components/DividerLine';

import { useSwapFeeLabels } from '../../hooks/useSwapFeeLabels';
import { KrakenFeeIcon } from '../KrakenFeeIcon';
import { RouteDetailsContent } from '../RouteDetailsContent';

import type { SwapRouteUIData } from '../../types';

import loc from '/loc';

type Props = {
  route: SwapRouteUIData;
  refreshFlashStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle | TextStyle>>>;
  isLoading?: boolean;
};

export const SwapConfirmationDetails: React.FC<Props> = ({ route, refreshFlashStyle, isLoading }) => {
  const swapFeeDetails = useSwapFeeLabels(route.fees);

  if (isLoading) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Animated.View style={refreshFlashStyle}>
        <DividerLine style={styles.topDivider} />
        <RouteDetailsContent
          rows={[
            { labelLeft: loc.swap.route.rate, labelRight: route.rate },

            { labelLeft: loc.swap.route.minumumOutput.title, tooltipText: loc.swap.route.minumumOutput.hint, labelRight: route.minOutputFormatted },
            { labelLeft: loc.swap.route.slippage.title, tooltipText: loc.swap.route.slippage.hint, labelRight: route.slippage },
          ]}
        />
        <DividerLine style={styles.bottomDivider} />
        <RouteDetailsContent
          rows={[
            {
              labelLeft: loc.swap.route.krakenFee.title,
              tooltipText: loc.swap.route.krakenFee.hint,
              labelRight: loc.swap.route.krakenFee.value,
              iconRight: <KrakenFeeIcon />,
            },
            ...swapFeeDetails,
          ]}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  topDivider: {
    marginBottom: 12,
    marginHorizontal: 12,
  },
  bottomDivider: {
    marginBottom: 12,
    marginTop: 4,
    marginHorizontal: 12,
  },
});
