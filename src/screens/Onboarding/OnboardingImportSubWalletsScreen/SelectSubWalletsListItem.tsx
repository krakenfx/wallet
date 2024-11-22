import { StyleSheet, View } from 'react-native';

import { AvatarIcon } from '@/components/AvatarIcon';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

type Props = { isSelected: boolean; subWalletId: number; subWalletIndex?: number; toggleSubWallet: () => void };

export const SelectSubWalletsListItem = ({ subWalletIndex, isSelected, subWalletId, toggleSubWallet }: Props) => {
  const { colors } = useTheme();

  return (
    <Touchable style={styles.selectableSubWallet} onPress={toggleSubWallet}>
      <View style={styles.left}>
        <AvatarIcon accountNumber={subWalletId} accountAvatar={null} avatarSize={36} />
        <View>
          <Label type="boldCaption1">{'Wallet name here'}</Label>
          <Label type="regularCaption1" color="light50">
            {}
            {'$Balance here'}
          </Label>
        </View>
        {subWalletIndex !== undefined && (
          <View style={[styles.walletIndex, { borderColor: colors.light15 }]}>
            <Label type="regularCaption1" color="light50">
              {'#' + subWalletIndex}
            </Label>
          </View>
        )}
      </View>
      <View>{isSelected ? <SvgIcon name="check-circle-filled" color="green500" /> : <SvgIcon name="check-circle-empty" color="light15" />}</View>
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
