import type React from 'react';

import { StyleSheet, View } from 'react-native';

import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';

import type { SwapQuoteRouteType } from '@/api/types';
import { Button } from '@/components/Button';
import { Menu } from '@/components/Menu';
import type { DropdownOptionItem } from '@/components/Menu/DropdownMenu';

import { useSwapFeeLabels } from '../../hooks/useSwapFeeLabels';
import { KrakenFeeIcon } from '../KrakenFeeIcon';
import { RouteDetailsContent } from '../RouteDetailsContent';

import { RoutePreviewButton } from '../RoutePreviewButton';

import { RouteTimeoutCircle } from '../RouteTimeoutCircle';

import { useSwapContext } from '../SwapContext';

import type { SwapRouteUIData } from '../../types';

import loc from '/loc';

type Props = {
  route: SwapRouteUIData;
  onRouteTypeChange: (type: DropdownOptionItem<SwapQuoteRouteType>) => void;
  selectedRouteType: SwapQuoteRouteType;
  showExplainer: () => void;
};

export const RouteDetails: React.FC<Props> = ({ route, showExplainer, selectedRouteType, onRouteTypeChange }) => {
  const menuOptions: DropdownOptionItem<SwapQuoteRouteType>[] = [
    {
      id: 'value',
      labelLeft: loc.swap.route.typeSelection.bestValue.desc,
    },
    {
      id: 'speed',
      labelLeft: loc.swap.route.typeSelection.fastest.desc,
    },
  ];

  const { refreshCountdownProgress, refreshFlashStyle } = useSwapContext();

  const selectedTypeLabel = selectedRouteType === 'value' ? loc.swap.route.typeSelection.bestValue.name : loc.swap.route.typeSelection.fastest.name;

  const swapFeeDetails = useSwapFeeLabels(route.fees);

  return (
    <Animated.View entering={FadeInUp} exiting={FadeOut}>
      <Animated.View style={[styles.container, refreshFlashStyle]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Menu
              type="dropdown"
              title={loc.swap.route.typeSelection.title}
              selectedId={selectedRouteType}
              checkSelected
              options={menuOptions}
              menuXOffset={-12}
              onSelect={onRouteTypeChange}>
              <Button text={selectedTypeLabel} color="purple_20" icon="chevron-down" iconRight />
            </Menu>
            <RouteTimeoutCircle progress={refreshCountdownProgress} />
          </View>
          <RoutePreviewButton onPress={showExplainer} duration={route.duration} steps={route.steps} />
        </View>
        <RouteDetailsContent
          collapsible
          roundedTop
          rows={[
            {
              labelLeft: loc.swap.route.rate,
              labelRight: route.rate,
            },

            {
              labelLeft: loc.swap.route.minumumOutput.title,
              tooltipText: loc.swap.route.minumumOutput.hint,
              labelRight: route.minOutputFormatted,
            },
            {
              labelLeft: loc.swap.route.slippage.title,
              tooltipText: loc.swap.route.slippage.hint,
              labelRight: route.slippage,
            },
          ]}
        />
        <RouteDetailsContent
          collapsible
          roundedBottom
          rows={[
            {
              labelLeft: loc.swap.route.transactionFees,
              labelRight: route.transactionFeesTotalFiat,
            },
            {
              labelLeft: loc.swap.route.krakenFee.title,
              tooltipText: loc.swap.route.krakenFee.hint,
              iconRight: <KrakenFeeIcon />,
              labelRight: loc.swap.route.krakenFee.value,
            },
            ...swapFeeDetails,
          ]}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
