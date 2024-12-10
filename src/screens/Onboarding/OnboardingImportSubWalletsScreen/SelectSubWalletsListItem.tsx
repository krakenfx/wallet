import { StyleSheet, View } from 'react-native';

import { AvatarIcon } from '@/components/AvatarIcon';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

import type { SubWallet } from './OnboardingImportSubWalletsScreen.types';

import loc from '/loc';

type Props = {
  isSelected: boolean;

  showSubWalletIndex: boolean;
  subWallet: SubWallet;
  toggleSubWallet: () => void;
};

export const SelectSubWalletsListItem = ({ subWallet, isSelected, showSubWalletIndex, toggleSubWallet }: Props) => {
  const isMainWallet = subWallet.index === 0;
  const { colors } = useTheme();

  return (
    <Touchable style={styles.selectableSubWallet} onPress={toggleSubWallet} disabled={isMainWallet}>
      <View style={styles.left}>
        <AvatarIcon accountNumber={subWallet.index} accountAvatar={subWallet.avatar ?? null} avatarSize={36} />
        <View>
          <Label type="boldCaption1">{subWallet.name}</Label>
          <Label type="regularCaption1" color="light50">
            {subWallet.hasBalance && loc.onboardingImportSubWallets.importSubWallets.hasBalance}
          </Label>
        </View>
        {showSubWalletIndex && (
          <View style={[styles.walletIndex, { borderColor: colors.light15 }]}>
            <Label type="regularCaption1" color="light50">
              {'#' + subWallet.index}
            </Label>
          </View>
        )}
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
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingLeft: 24,
    paddingRight: 18,
    paddingVertical: 12,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    gap: 11,
  },
  walletIndex: {
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    height: 19,
    lineHeight: 19,
    paddingHorizontal: 6,
  },
  checkCircleEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
});
