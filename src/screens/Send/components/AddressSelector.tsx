import Clipboard from '@react-native-clipboard/clipboard';
import { useCameraPermissions } from 'expo-camera';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated, { CurvedTransition, FadeIn, FadeOut } from 'react-native-reanimated';

import { ActivityIndicator } from '@/components/ActivityIndicator/ActivityIndicator';
import { AddressDisplay } from '@/components/AddressDisplay';
import { CardWarning } from '@/components/CardWarning';
import type { InputMethods } from '@/components/Input';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { useKeyboardEvent } from '@/hooks/useKeyboardEvent';
import type { Network } from '@/onChain/wallets/base';
import { EVMNetwork } from '@/onChain/wallets/evm';
import { showPermissionDeniedAlert } from '@/utils/cameraPermissions';
import { hapticFeedback } from '@/utils/hapticFeedback';

import { useNameResolver } from '../hooks/useNameResolver';
import { useFormField } from '../utils/sendForm';

import { AddressAnalysisInfo } from './AddressAnalysisInfo';

import type { AddressAnalysis } from '../hooks/useAddressAnalysis';

import loc from '/loc';

type Props = {
  networks: Network[];
  address: string;
  onChangeAddress: (address: string) => void;
  onValidName: (name: string, address: string) => void;
  onScanRequest: () => void;
  showTitle?: boolean;
  autoFocus?: boolean;
  addressAnalysis?: AddressAnalysis;
};

export const AddressSelector: React.FC<Props> = React.memo(
  ({ networks, address, onChangeAddress, onValidName, onScanRequest, showTitle, autoFocus, addressAnalysis }) => {
    const inputRef = useRef<InputMethods>(null);

    const [formattedAddressVisible, setFormattedAddressVisible] = useState(false);
    const [hasFocus, setHasFocus] = useState(autoFocus);
    const touched = useRef(false);
    const [errorMessage, setErrorMessage] = useState('');
    const formField = useFormField('address');
    const [_, requestPermission] = useCameraPermissions();

    const evmNetwork = useMemo(() => networks.find(n => n instanceof EVMNetwork), [networks]);
    const nameResolver = useNameResolver(evmNetwork ?? networks[0], address);
    const [success, setSuccess] = useState(false);

    const setTouched = () => {
      touched.current = true;
    };

    const onSuccess = useCallback(
      (showValidState: boolean) => {
        formField.setValid();
        setErrorMessage('');
        if (!touched.current) {
          return;
        }
        if (!showValidState) {
          return;
        }
        setSuccess(true);
        hapticFeedback.notificationSuccess();
        setTimeout(() => {
          setSuccess(false);
        }, 4000);
      },
      [formField],
    );

    useEffect(() => {
      if (!touched.current) {
        return;
      }
      if (!addressAnalysis?.result) {
        return;
      }
      switch (addressAnalysis.result.warning?.severity) {
        case 'CRITICAL': {
          hapticFeedback.notificationError();
          break;
        }
        case 'WARNING': {
          hapticFeedback.impactLight();
          break;
        }
        default: {
          onSuccess(true);
        }
      }
    }, [addressAnalysis?.result, onSuccess]);

    const onScanPress = async () => {
      const result = await requestPermission();
      if (result.granted) {
        setErrorMessage('');
        setTouched();
        onScanRequest();
      } else {
        showPermissionDeniedAlert();
      }
    };

    const focusInput = () => {
      setFormattedAddressVisible(false);
      inputRef.current?.focus();
      formField.clear();
    };

    useEffect(() => {
      const validNetwork = networks.find(n => n.isAddressValid(address));
      if (validNetwork && (!hasFocus || !touched.current)) {
        setFormattedAddressVisible(true);
        inputRef.current?.blur();
        const shouldShowValidState = !(validNetwork instanceof EVMNetwork);
        onSuccess(shouldShowValidState);
        return;
      }
    }, [address, formField, hasFocus, networks, onSuccess]);

    useEffect(() => {
      if (nameResolver.resolved && !nameResolver.isLoading) {
        onValidName(nameResolver.resolved.name, nameResolver.resolved.address);
        onSuccess(false);
      }
    }, [nameResolver.isLoading, nameResolver.resolved, onSuccess, onValidName]);

    useEffect(() => {
      if (nameResolver.isLoading) {
        formField.clear();
        setErrorMessage('');
        return;
      }
      if (hasFocus) {
        return;
      }
      
      const hasInvalidAddress = address && !networks.some(n => n.isAddressValid(address)) && !nameResolver.isValidName;
      const hasInvalidName = nameResolver.unresolved;
      if (hasInvalidAddress || hasInvalidName) {
        setErrorMessage(nameResolver.hasError ? loc.send.technicalIssues : loc.send.invalidAddress);
        formField.setInvalid();
      }
    }, [
      address,
      formField,
      hasFocus,
      nameResolver.hasError,
      nameResolver.isLoading,
      nameResolver.isValidName,
      nameResolver.resolved,
      nameResolver.unresolved,
      networks,
    ]);

    const onFocus = () => {
      setHasFocus(true);
      setErrorMessage('');
      formField.clear();
      setTouched();
    };

    const onPasteClipboard = async () => {
      focusInput();
      const clipboardValue = await Clipboard.getString();
      setTouched();
      onChangeAddress(clipboardValue);
      inputRef.current?.blur();
    };

    const onBlur = () => {
      setHasFocus(false);
      if (!address) {
        formField.clear();
      } else if (networks.some(n => n.isAddressValid(address))) {
        setFormattedAddressVisible(true);
        formField.setValid();
      } else if (nameResolver.isValidName) {
        formField.setValid();
      }
    };

    const scanIcon = (
      <View style={[styles.icons, !!address && hasFocus && styles.iconsHidden]}>
        <SvgIcon name="paste" style={styles.pasteButton} onPress={onPasteClipboard} />
        <SvgIcon name="scan" style={styles.scan} onPress={onScanPress} />
      </View>
    );

    const handleKeyboardClosed = useCallback(() => {
      inputRef.current?.blur();
    }, []);

    useKeyboardEvent('keyboardDidHide', handleKeyboardClosed);

    const onChangeText = (text: string) => {
      onChangeAddress(text.trim());
    };

    return (
      <>
        <Animated.View layout={CurvedTransition}>
          {showTitle && (
            <Label type="boldTitle2" style={styles.sectionHeader}>
              {loc.send.addressHeader}
            </Label>
          )}
          <View>
            <Input
              autoFocus={autoFocus}
              ref={inputRef}
              errorText={errorMessage}
              type="regularMonospace"
              onBlur={onBlur}
              onFocus={onFocus}
              clearButtonMode="while-editing"
              onChangeText={onChangeText}
              autoCapitalize="none"
              value={address}
              placeholder={nameResolver.isNetworkSupported ? loc.send.addressOrENS : loc.send.address}
              placeholderType="regularBody"
              testID="AddressInput"
              errorMessageTestID="AddressInputError"
              containerStyle={styles.input}
              right={(nameResolver.isLoading || addressAnalysis?.isLoading) && !hasFocus ? <ActivityIndicator /> : scanIcon}
              borderColorOnFocus={success ? 'green500' : 'kraken'}
              borderColorOnBlur={success ? 'green500' : addressAnalysis?.accentColor}
              backgroundColor="dark50"
              inputStyle={[styles.flex, formattedAddressVisible && styles.hidden]}
            />
            <View
              pointerEvents={formattedAddressVisible ? 'box-none' : 'none'}
              style={[styles.formattedAddressOverlay, !formattedAddressVisible && styles.hidden]}>
              <TouchableWithoutFeedback onPress={focusInput}>
                <AddressDisplay address={address} containerStyle={styles.addressDisplay} />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Animated.View>
        {addressAnalysis && !hasFocus && <AddressAnalysisInfo addressAnalysis={addressAnalysis} />}
        {nameResolver.isSuspicious && (
          <Animated.View entering={FadeIn} exiting={FadeOut} layout={CurvedTransition}>
            <CardWarning
              style={styles.suspiciousCharWarning}
              title={loc.send.suspiciousCharWarning.title}
              description={loc.send.suspiciousCharWarning.desc}
              type="warning"
              testID="SuspiciousCharWarning"
            />
          </Animated.View>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  scan: {
    marginLeft: 8,
  },
  flex: {
    flex: 1,
  },
  input: {
    marginBottom: 16,
  },
  hidden: {
    opacity: 0,
  },
  iconsHidden: {
    opacity: 0,
    width: 0,
  },
  formattedAddressOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    marginRight: 60,
  },
  sectionHeader: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suspiciousCharWarning: {
    marginBottom: 16,
  },
  icons: {
    flexDirection: 'row',
  },
  pasteButton: {
    marginHorizontal: 8,
  },
  addressDisplay: {
    maxWidth: '90%',
  },
});
