import { Image, StyleSheet, View } from 'react-native';

import { Card } from '@/components/Card';
import { Label } from '@/components/Label';

import { TokenIcon } from '@/components/TokenIcon';
import { useAppCurrency } from '@/realm/settings';
import { useTokenByAssetId } from '@/realm/tokens';
import { useCurrentUsdFiatRate } from '@/realm/usdFiatRates';
import { useWalletByAssetId } from '@/realm/wallets/useWalletByAssetId';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmountFromToken } from '@/utils/formatTokenAmountFromToken';

import { Sizes } from '../../EarnScreen.constants';

import type { DefiHighlightHeroContentProps } from './DefiHighlightHeroContent.types';

import { capitalizeFirstLetter } from '/helpers/capitalizeFirstLetter';

import loc from '/loc';

export const DefiHighlightHeroContent: React.FC<DefiHighlightHeroContentProps> = ({ vault }) => {
  const assetId = vault.assetId;

  const wallet = useWalletByAssetId(assetId);
  const token = useTokenByAssetId(assetId, wallet.id);
  const { currency } = useAppCurrency();
  const tokenAmountFormatted = token ? formatTokenAmountFromToken(token, { compact: true, currency }) : 0;

  const usdFiatRate = useCurrentUsdFiatRate();
  const valueInUserCurrency = usdFiatRate * vault.tvlInUsd;
  const formattedTvl = formatCurrency(valueInUserCurrency, { currency, hideCurrencySign: true, compact: true, hideDecimals: true });

  const formattedProtocolName = vault.protocolName.split(' ').map(capitalizeFirstLetter).join(' ');

  return (
    <View style={styles.container}>
      <Card size="large">
        <Image style={StyleSheet.absoluteFill} source={require('@/assets/images/common/walletSecureCoins.png')} />
        <View style={styles.cardContent}>
          <View style={styles.topRow}>
            <TokenIcon size={80} tokenId={assetId} tokenSymbol={vault.assetSymbol} wallet={wallet} />

            <View style={styles.protocol}>
              <View style={styles.protocolDescription}>
                <Label type="boldBody" color="light100">
                  {formattedProtocolName}
                </Label>
                <Label type="regularCaption1" color="light50">
                  {}
                  Lending
                </Label>
              </View>

              <Image source={{ uri: vault.protocolLogoUrl }} style={styles.icon} />
            </View>
          </View>

          <View>
            <Label type="boldDisplay5">
              {loc.formatString(loc.earn.heroTitle, {
                symbol: vault.assetSymbol,
                protocol: formattedProtocolName,
              })}
            </Label>

            <Label type="regularCaption1" color="light50">
              {loc.formatString(loc.earn.heroAvailableBalance, { balance: tokenAmountFormatted, symbol: vault.assetSymbol })}
            </Label>
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.bottomRowTextContainer}>
              <Label type="headerMarketDataPrice" color="green400">
                {vault.apy}%
              </Label>
              <Label type="mediumCaption1" color="green400">
                {loc.earn.apy}
              </Label>
            </View>

            <View style={styles.bottomRowTextContainer}>
              <Label type="headerMarketDataPrice" color="light50">
                {formattedTvl}
              </Label>
              <Label type="mediumCaption1" color="light50">
                {loc.defi.tvl}
              </Label>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Sizes.Space.s2,
  },
  cardContent: {
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  protocol: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  protocolDescription: {
    alignItems: 'flex-end',
  },
  icon: {
    height: 32,
    width: 32,
    borderRadius: 7.5,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 32,
  },
  bottomRowTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
});
