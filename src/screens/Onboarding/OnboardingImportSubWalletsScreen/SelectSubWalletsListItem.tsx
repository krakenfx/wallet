import { Platform, StyleSheet, View } from 'react-native';

import { AvatarIcon } from '@/components/AvatarIcon';
import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

import type { SubWallet } from './OnboardingImportSubWalletsScreen.types';

import loc from '/loc';

type Props = {
  backgroundGradient?: boolean;
  compact?: boolean;
  isSelected: boolean;
  showSubWalletIndex?: boolean | 'compact';
  subWallet: SubWallet;
  toggleSubWallet: () => void;
};

export const SelectSubWalletsListItem = ({ backgroundGradient, isSelected, showSubWalletIndex, subWallet, toggleSubWallet }: Props) => {
  const isMainWallet = subWallet.index === 0;
  const { colors } = useTheme();
  const showSubWalletIndexCompact = showSubWalletIndex === 'compact';
  const showSubWalletIndex_ = showSubWalletIndex === true;

  return (
    <Touchable
      style={[styles.selectableSubWallet, backgroundGradient && styles.selectableSubWalletWithBackground]}
      onPress={toggleSubWallet}
      disabled={isMainWallet}>
      {backgroundGradient && <GradientItemBackground />}
      <View style={styles.left}>
        <AvatarIcon accountNumber={subWallet.index} accountAvatar={subWallet.avatar ?? null} avatarSize={36} />
        <View style={[styles.leftLabels, showSubWalletIndex_ && styles.leftLabelsShowIndex]}>
          <View style={showSubWalletIndex_ && styles.nameContainerShowIndex}>
            <Label type="boldCaption1" numberOfLines={1}>
              {subWallet.name}
            </Label>
            <Label type="regularCaption1" color="light50" numberOfLines={1}>
              {subWallet.hasBalance && loc.onboardingImportSubWallets.importSubWallets.hasBalance}
            </Label>
          </View>
          {(showSubWalletIndex_ || showSubWalletIndexCompact) && (
            <View style={[styles.walletIndex, { borderColor: colors.light15 }]}>
              <Label type="regularCaption1" color="light50" style={styles.walletIndexLabel}>
                {'#' + subWallet.index}
              </Label>
            </View>
          )}
        </View>
      </View>
      <View>
        {isSelected || isMainWallet ? (
          <SvgIcon name="check-circle-filled" color={isMainWallet ? 'green400_15' : 'green500'} />
        ) : (
          <SvgIcon name="check-circle-empty" color="light15" />
        )}
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  selectableSubWallet: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 18,
    paddingVertical: 12,
  },
  selectableSubWalletWithBackground: {
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    gap: 11,
  },
  leftLabels: {
    flexDirection: 'row',
    gap: 11,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  leftLabelsShowIndex: {
    width: 150,
  },
  nameContainerShowIndex: {
    maxWidth: 90,
  },
  walletIndex: {
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    height: 19,
    paddingHorizontal: 6,
  },
  walletIndexLabel: {
    height: Platform.OS === 'android' ? 19 : 'auto',
  },
  checkCircleEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
});
