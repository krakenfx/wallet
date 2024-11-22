import type React from 'react';

import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { ImageSvg } from '@/components/ImageSvg';
import { Label } from '@/components/Label';
import { NetworkIcon } from '@/components/NetworkIcon';

import { useAssetMetadata } from '@/realm/assetMetadata';
import { useAppCurrency } from '@/realm/settings';
import { useTokenPrice } from '@/realm/tokenPrice';
import { getNetworkNameFromAssetId } from '@/realm/tokens/utils';
import { formatCurrency } from '@/utils/formatCurrency';
import { unitConverter } from '@/utils/unitConverter';

import { useOptionalSwapContext } from '../SwapContext';

import type { FeeDetails } from '../../types';

type Props = {
  feeDetails: FeeDetails;
};

export const RouteFeeDetails: React.FC<Props> = ({ feeDetails: { assetId, amount, iconProps, key } }) => {
  const networkName = getNetworkNameFromAssetId(assetId);

  const context = useOptionalSwapContext();

  const [_, setFeeFiatValues] = context ? context.swapFeesFiatValueState : [];

  const tokenPrice = useTokenPrice({ assetId });
  const metadata = useAssetMetadata({ assetId });

  const { currency } = useAppCurrency();

  const fiatValue = tokenPrice && metadata && amount ? unitConverter.smallestUnit2Fiat(amount, metadata.decimals, tokenPrice).toNumber() : undefined;

  const fiatValueFormatted = fiatValue !== undefined ? formatCurrency(fiatValue, { currency }) : undefined;

  useEffect(() => {
    if (!setFeeFiatValues) {
      return;
    }
    if (fiatValue) {
      setFeeFiatValues(values => ({
        ...values,
        [key]: fiatValue,
      }));
    }
  }, [key, fiatValue, setFeeFiatValues]);

  return (
    <>
      {iconProps.type === 'asset' && <NetworkIcon networkName={networkName} size={16} />}
      {iconProps.type === 'image' && <ImageSvg style={styles.imageIcon} uri={iconProps.uri} />}
      <Label color="light75" type="boldCaption1">
        {fiatValueFormatted ?? '-'}
      </Label>
    </>
  );
};

const styles = StyleSheet.create({
  imageIcon: {
    width: 16,
    height: 16,
    backgroundColor: 'transparent',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
