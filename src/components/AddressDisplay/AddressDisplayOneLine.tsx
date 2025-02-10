import Clipboard from '@react-native-clipboard/clipboard';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import { Label } from '@/components/Label';

import type { SvgIconProps } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';

import { Touchable } from '@/components/Touchable';

import { useTheme } from '@/theme/themes';

import loc from '/loc';

interface Props {
  address: string;
}

const COPIED_STATE: Record<string, { name: SvgIconProps['name']; color: SvgIconProps['color'] }> = {
  PRISTINE: { name: 'copy', color: 'light75' },
  COPIED: { name: 'check-circle-filled', color: 'green400' },
};

const SHOW_CHECKMARK_DURATION = 2300;

export const AddressDisplayOneLine = ({ address }: Props) => {
  const [icon, setIcon] = useState(COPIED_STATE.PRISTINE);
  const { colors } = useTheme();

  const onPress = useCallback(async () => {
    setIcon(COPIED_STATE.COPIED);
    Clipboard.setString(address);
    setTimeout(() => setIcon(COPIED_STATE.PRISTINE), SHOW_CHECKMARK_DURATION);
  }, [address]);

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} testID="AddressDisplayOneLine" style={styles.view}>
      <Touchable style={styles.container} onPress={onPress}>
        {icon === COPIED_STATE.COPIED ? (
          <Label type="boldMonospace" color="green400">
            {loc.earn.detailsSheet.info.addressCopied}
          </Label>
        ) : (
          <Label type="regularBody" color="light100" style={styles.address} numberOfLines={1} ellipsizeMode={'middle'}>
            {address}
          </Label>
        )}

        <View style={styles.icon}>
          {icon === COPIED_STATE.COPIED ? (
            <>
              <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.green400_15 }]} />
              <SvgIcon size={24} entering={ZoomIn} exiting={FadeOut} {...icon} />
            </>
          ) : (
            <>
              <GradientItemBackground />
              <SvgIcon size={24} entering={FadeIn} exiting={FadeOut} {...icon} onPress={onPress} />
            </>
          )}
        </View>
      </Touchable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    height: 48,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  address: {
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: 200,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    overflow: 'hidden',
    width: 40,
    height: 40,
  },
  header: {
    marginBottom: 10,
  },
});
