import type React from 'react';

import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { StyleSheet, View } from 'react-native';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { BottomSheetModal } from '@/components/BottomSheet';
import type { FloatingBottomButtonsProps } from '@/components/FloatingBottomButtons';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';

import { Label } from '@/components/Label';

import { useTheme } from '@/theme/themes';

import { PasskeyErrorContent } from './PasskeyErrorContent';

import loc from '/loc';

export type PasskeyErrorType =
  | 'passkeyErrorUserCanceledRegistration'
  | 'passkeyErrorReading'
  | 'passkeyErrorWriting'
  | 'passkeyErrorWritingWrongDevice'
  | 'passkeyErrorDeleting'
  | 'passkeyErrorInactive';

export type CloudBackupErrorSheetRef = BottomSheetModalRef;

type Props = {
  type: PasskeyErrorType;
  onClose: () => void;
  onRetry?: () => void;
};

export const CloudBackupErrorSheet: React.FC<Props> = ({ type, onClose, onRetry }) => {
  const sheetRef = useRef<BottomSheetModalRef>(null);

  const dismiss = useCallback(() => {
    sheetRef.current?.close();
    onClose();
  }, [onClose]);

  useEffect(() => {
    sheetRef.current?.present();
  }, []);

  const { colors } = useTheme();

  const content = useMemo(
    () => {
      switch (type) {
        case 'passkeyErrorReading': {
          return (
            <PasskeyErrorContent
              suggestKeychainSettings
              title={loc.walletCloudBackupError.noPasskeyFound.title}
              description={loc.walletCloudBackupError.noPasskeyFound.description}
              suggestManualImport
            />
          );
        }
        case 'passkeyErrorWriting': {
          return (
            <PasskeyErrorContent
              suggestKeychainSettings
              title={loc.walletCloudBackupError.errorCreatingPasskey.title}
              description={loc.walletCloudBackupError.ensureICloudKeychainOn}
            />
          );
        }
        case 'passkeyErrorDeleting': {
          return (
            <PasskeyErrorContent
              suggestKeychainSettings
              title={loc.walletCloudBackupError.errorDeletingPasskey.title}
              description={loc.walletCloudBackupError.ensureICloudKeychainOn}
              suggestSupport={false}>
              <View style={[styles.divider, { backgroundColor: colors.light15 }]} />
              <Label type="regularBody" color="light75">
                {loc.walletCloudBackupError.errorDeletingPasskey.deletedPasskeyPossibility}
              </Label>
            </PasskeyErrorContent>
          );
        }
        case 'passkeyErrorInactive': {
          return (
            <PasskeyErrorContent
              title={loc.walletCloudBackupError.errorInactive.title}
              subtitle={loc.walletCloudBackupError.errorInactive.subtitle}
              description={loc.walletCloudBackupError.errorInactive.description}
              suggestSupport={false}
            />
          );
        }
        case 'passkeyErrorUserCanceledRegistration': {
          return (
            <PasskeyErrorContent
              title={loc.walletCloudBackupError.userCanceledBackup.title}
              description={loc.walletCloudBackupError.userCanceledBackup.description}
              suggestSupport={false}
            />
          );
        }
        case 'passkeyErrorWritingWrongDevice':
          return (
            <PasskeyErrorContent
              title={loc.walletCloudBackupError.errorCreatingBackup.title}
              description={loc.walletCloudBackupError.errorCreatingBackup.description}>
              <Label type="regularBody" color="light75">
                {loc.walletCloudBackupError.errorCreatingBackup.tryAgainRegular}
                <Label type="boldBody" color="light75">
                  {loc.walletCloudBackupError.errorCreatingBackup.tryAgainBold}
                </Label>
              </Label>
            </PasskeyErrorContent>
          );
        default:
          return null;
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type],
  );

  const buttonProps: FloatingBottomButtonsProps = useMemo(() => {
    switch (type) {
      case 'passkeyErrorWritingWrongDevice': {
        return {
          primary: {
            text: loc.walletCloudBackupError.errorCreatingBackup.tryAgainButton,
            onPress: onRetry,
          },
          secondary: {
            text: loc.walletCloudBackupError.errorCreatingBackup.cancel,
            onPress: dismiss,
          },
        };
      }
      case 'passkeyErrorUserCanceledRegistration': {
        return {
          primary: {
            text: loc._.ok,
            onPress: onRetry,
          },
          secondary: {
            text: loc.walletCloudBackupError.userCanceledBackup.cancel,
            onPress: dismiss,
          },
        };
      }
      case 'passkeyErrorDeleting': {
        return {
          primary: {
            text: loc.walletCloudBackupError.errorDeletingPasskey.removeItButton,
            onPress: onRetry,
          },
          secondary: {
            text: loc.walletCloudBackupError.errorDeletingPasskey.cancel,
            onPress: dismiss,
          },
        };
      }
      default: {
        return {
          primary: {
            text: loc._.ok,
            onPress: dismiss,
          },
        };
      }
    }
  }, [dismiss, onRetry, type]);

  return (
    <BottomSheetModal onDismiss={onClose} enableDynamicSizing ref={sheetRef}>
      <BottomSheetView testID="CloudBackupErrorSheet">
        {content}
        <FloatingBottomButtons noAbsolutePosition {...buttonProps} />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
  },
});
