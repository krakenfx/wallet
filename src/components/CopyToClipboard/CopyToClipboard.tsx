import type { PropsWithChildren } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';
import React, { useCallback, useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';

import type { SvgIconProps } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';
import { showToast } from '@/components/Toast';
import { Touchable } from '@/components/Touchable';

import loc from '/loc';

const onCopyToClipboard = (copiedString: string, text = loc._.copyToClipboard) => {
  Clipboard.setString(copiedString);
  return showToast({
    type: 'success',
    text,
  });
};



const SHOW_CHECKMARK_DURATION = 4300;

type Props = {
  stringToCopy?: string;
  toastMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
  testID?: string;
};

const COPIED_STATE: Record<string, { name: SvgIconProps['name']; color: SvgIconProps['color'] }> = {
  PRISTINE: { name: 'copy', color: 'light100' },
  COPIED: { name: 'checkmark', color: 'green400' },
};

export const CopyToClipBoard: React.FC<PropsWithChildren & Props> = ({
  children,
  stringToCopy,
  toastMessage,
  containerStyle,
  contentStyle,
  iconContainerStyle,
  testID,
}) => {
  const [icon, setIcon] = useState(COPIED_STATE.PRISTINE);

  const onPress = useCallback(async () => {
    if (!stringToCopy) {
      return;
    }
    setIcon(COPIED_STATE.COPIED);
    await onCopyToClipboard(stringToCopy, toastMessage);
    setTimeout(() => setIcon(COPIED_STATE.PRISTINE), SHOW_CHECKMARK_DURATION);
  }, [stringToCopy, toastMessage]);

  return (
    <Touchable style={[styles.container, containerStyle]} onPress={onPress} disabled={!stringToCopy}>
      <View style={[styles.cell, contentStyle]} testID={testID}>
        {children}
      </View>
      <View style={iconContainerStyle}>
        {icon === COPIED_STATE.COPIED ? (
          <SvgIcon entering={ZoomIn} exiting={FadeOut} {...icon} />
        ) : (
          <SvgIcon entering={FadeIn} exiting={FadeOut} {...icon} onPress={onPress} />
        )}
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    gap: 20,
    justifyContent: 'space-between',
  },
  cell: {
    flexShrink: 2,
    flex: 1,
  },
});
