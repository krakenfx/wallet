import type React from 'react';

import { addSeconds, formatDistanceStrict } from 'date-fns';
import { useMemo } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import type { SwapQuoteAsset, SwapRouteTXStep } from '@/api/types';
import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import { type IconName, SvgIcon } from '@/components/SvgIcon';

import { TokenIcon } from '@/components/TokenIcon';
import { useAssetMetadata } from '@/realm/assetMetadata';
import { useAppCurrency } from '@/realm/settings';
import { useWalletByAssetId } from '@/realm/wallets/useWalletByAssetId';
import { useTheme } from '@/theme/themes';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { isBtc } from '@/utils/isBtc';
import { unitConverter } from '@/utils/unitConverter';

import loc from '/loc';
import { getDateLocale } from '/loc/date';

type Props = {
  step: SwapRouteTXStep;
  isFirst: boolean;
  isLast: boolean;
};

type AssetProps = SwapQuoteAsset & {
  containerStyle?: StyleProp<ViewStyle>;
};

const RouteStepAsset: React.FC<AssetProps> = ({ amount, assetId, containerStyle }) => {
  const metadata = useAssetMetadata({ assetId });
  const wallet = useWalletByAssetId(assetId);
  const { colors } = useTheme();
  const { currency } = useAppCurrency();

  const outputFormatted =
    metadata && amount
      ? formatTokenAmount(unitConverter.smallUnit2TokenUnit(amount, metadata.decimals).toString(10), {
          compact: true,
          currency,
          highPrecision: true,
          isBtc: isBtc({ assetId: assetId }),
        })
      : undefined;

  return (
    <View style={[styles.assetContainer, { backgroundColor: colors.purple_30 }, containerStyle]}>
      <TokenIcon tokenId={assetId} tokenSymbol={metadata?.symbol} wallet={wallet} />
      <View style={styles.assetContent}>
        <Label type="boldCaption1">{outputFormatted}</Label>
        <Label type="mediumCaption2" color="light75">
          {metadata?.symbol}
        </Label>
      </View>
    </View>
  );
};

export const SwapRouteExplainerStep: React.FC<Props> = ({ step, isFirst, isLast }) => {
  const { colors } = useTheme();

  const data: {
    icon: IconName;
    label: string | string[];
  } = useMemo(() => {
    switch (step.provider.type) {
      case 'bridge': {
        return {
          icon: 'bridge',
          label: loc.formatString(loc.swap.routePath.bridge, { name: step.provider.name }),
        };
      }
      case 'swap': {
        return {
          icon: 'swap',
          label: loc.formatString(loc.swap.routePath.swap, { name: step.provider.name }),
        };
      }
    }
  }, [step]);

  const now = Date.now();
  const durationFormatted = step.timeEstimate
    ? `~${formatDistanceStrict(addSeconds(now, step.timeEstimate), now, {
        locale: getDateLocale(),
      })}`
    : undefined;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.assets}>
          <RouteStepAsset assetId={step.fromAsset.assetId} amount={step.fromAsset.amount} containerStyle={[isFirst && styles.assetTopLeft]} />
          <RouteStepAsset assetId={step.toAsset.assetId} amount={step.toAsset.amount} containerStyle={[styles.assetRight, isFirst && styles.assetTopRight]} />
          {!!data.icon && (
            <View style={styles.iconOverlay}>
              <SvgIcon
                color="light75"
                size={16}
                name={data.icon}
                style={[
                  styles.icon,
                  {
                    backgroundColor: colors.swapIconBg,
                    borderColor: colors.swapIconBorder,
                  },
                ]}
              />
            </View>
          )}
        </View>
        <View style={[styles.footer, isLast && styles.lastStep, { backgroundColor: colors.purple_30 }]}>
          <View style={styles.providerInfo}>
            <ImageSvg uri={step.provider.icon} style={styles.providerIcon} />
            <Label type="boldCaption1">{data.label}</Label>
          </View>
          {!!durationFormatted && (
            <Label type="boldCaption1" color="light50">
              {durationFormatted}
            </Label>
          )}
        </View>
      </View>
      {isFirst && !isLast && (
        <View style={[styles.divider, { backgroundColor: colors.purple_15 }]}>
          <SvgIcon color="light50" name="double-chevron-down" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 1,
  },
  assets: {
    flexDirection: 'row',
    gap: 1,
  },
  assetContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    flex: 1,
  },
  assetContent: {
    justifyContent: 'space-evenly',
  },
  iconOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 2,
  },
  assetTopRight: {
    borderTopRightRadius: 20,
  },
  assetTopLeft: {
    borderTopLeftRadius: 20,
  },
  footer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lastStep: {
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  assetRight: {
    justifyContent: 'flex-end',
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  providerIcon: {
    backgroundColor: 'transparent',
    width: 16,
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  divider: {
    alignItems: 'center',
  },
});
