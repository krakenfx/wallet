import Clipboard from '@react-native-clipboard/clipboard';
import React, { useCallback, useState } from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { showToast } from '@/components/Toast';

import loc from '/loc';

export type AddressDisplayProps = {
  address: string;
  stringToCopy?: string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  boldPrefix?: boolean;
  hasSpaces?: boolean;
  showButton?: boolean;
  ensName?: string;
  showEnsNameOnly?: boolean; 
  anyNumberOfLines?: boolean;
};

export const AddressDisplay: React.FC<AddressDisplayProps> = React.memo(
  ({ address, hasSpaces, boldPrefix, stringToCopy = '', style, containerStyle, textStyle, showButton, ensName, showEnsNameOnly, anyNumberOfLines }) => {
    if (!stringToCopy) {
      stringToCopy = address;
    }
    const part1 = address.substring(0, Math.floor(address.length / 2));
    const part2 = address.substring(Math.floor(address.length / 2));

    const component1 = part1.substring(0, 6);
    const component2 = part1.substring(6);
    const component3 = part2.substring(0, part2.length - 6);
    const component4 = part2.substring(part2.length - 6);

    const [copied, setCopied] = useState(false);

    const onPressFunction = useCallback(() => {
      Clipboard.setString(String(stringToCopy));
      showToast({ type: 'success', text: loc.receive.addressCopied });
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 4000);
    }, [stringToCopy]);

    const edgesLabelType = boldPrefix ? 'boldLargeMonospace' : 'regularLargeMonospace';

    return (
      <View style={[styles.container, containerStyle]} testID="AddressDisplay">
        {ensName ? (
          <View style={styles.ens}>
            <SvgIcon name="ens" color="light75" />
            <Label type="boldBody">{ensName}</Label>
          </View>
        ) : null}
        {!showEnsNameOnly && (
          <View style={[styles.addressContainer, style]}>
            <Label
              style={[styles.address, textStyle]}
              adjustsFontSizeToFit={true}
              numberOfLines={anyNumberOfLines ? undefined : 2}
              testID="WalletAddress"
              accessibilityLabel={address}>
              <Label type={edgesLabelType} textBreakStrategy="balanced" lineBreakMode="middle">
                {component1}
                {hasSpaces ? <Label color="transparent">_</Label> : ''}
              </Label>
              <Label type="regularLargeMonospace" color="light50">
                {component2}
                {!anyNumberOfLines && '\n'}
              </Label>
              <Label type="regularLargeMonospace" color="light50">
                {component3}
              </Label>
              <Label type={edgesLabelType}>
                {hasSpaces ? <Label color="transparent">_</Label> : ''}
                {component4}
              </Label>
            </Label>

            {showButton ? (
              <Button
                textType="boldBody"
                color={copied ? 'green400_15' : 'light15'}
                icon={copied ? 'checkmark' : 'copy'}
                iconColor={copied ? 'green400' : 'light100'}
                textColor={copied ? 'green400' : 'light100'}
                size="medium"
                onPress={onPressFunction}
                text={copied ? loc._.copied : loc._.copy}
                style={styles.button}
                testID="CopyButton"
              />
            ) : null}
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  addressContainer: {
    flexDirection: 'row',
  },
  button: {
    minWidth: 105,
    marginLeft: 8,
  },
  address: {
    flex: 1,
  },
  ens: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center',
    gap: 4,
  },
});
