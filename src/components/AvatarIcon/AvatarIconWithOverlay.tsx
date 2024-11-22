import type React from 'react';

import MaskedView from '@react-native-masked-view/masked-view';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Mask } from 'react-native-svg';

import { useTheme } from '@/theme/themes';

import { SvgIcon } from '../SvgIcon';

import type { AvatarIconWithOverlayProps } from './AvatarIcon.types';

export const AvatarIconWithOverlay: React.FC<AvatarIconWithOverlayProps> = ({ avatar, avatarSize, iconSize, iconPadding = 13 }) => {
  const { colors } = useTheme();

  const iconPosition = {
    top: avatarSize - iconSize / 2,
    left: avatarSize - iconSize / 2,
  };
  const iconMaskPosition = { x: iconPosition.left, y: iconPosition.top };

  const iconContainerStyle = {
    top: iconPosition.top - iconSize / 2,
    left: iconPosition.left - iconSize / 2,
    backgroundColor: colors.purple_40,
    height: iconSize,
    width: iconSize,
    borderRadius: iconSize / 2,
  };

  return (
    <>
      <MaskedView
        maskElement={
          <Svg>
            <Defs>
              <Mask id="moonShape" maskUnits="userSpaceOnUse">
                <Circle x={avatarSize / 2} y={avatarSize / 2} r={avatarSize / 2} fill={'white'} />
                <Circle {...iconMaskPosition} r={iconSize / 2 + 2} fill={'black'} />
              </Mask>
            </Defs>
            <G mask={'url(#moonShape)'}>
              <Circle x={avatarSize / 2} y={avatarSize / 2} r={avatarSize / 2} />
            </G>
          </Svg>
        }>
        {avatar}
      </MaskedView>
      {iconSize > 0 && (
        <View style={[styles.iconContainer, iconContainerStyle]}>
          <SvgIcon name="pencil" size={iconSize - iconPadding} style={styles.icon} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'absolute',
  },
});
