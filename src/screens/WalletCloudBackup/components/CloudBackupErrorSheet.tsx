import type React from 'react';

import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { BottomSheetModal } from '@/components/BottomSheet';
import type { FloatingBottomButtonsProps } from '@/components/FloatingBottomButtons';
import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';

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

  const content = useMemo(() => {
    switch (type) {
      case 'passkeyErrorReading': {
        return (
          <PasskeyErrorContent
            title={loc.walletCloudBackupError.noPasskeyFound.title}
            showDescripton
            noPasskeyFound
            suggestKeychainSettings
            suggestManualImport
            suggestSupport
          />
        );
      }
      case 'passkeyErrorWriting': {
        return (
          <PasskeyErrorContent
            showDescripton
            showKeychainImage
            suggestKeychainSettings
            suggestSupport
            title={loc.walletCloudBackupError.errorCreatingPasskey.title}
          />
        );
      }
      case 'passkeyErrorDeleting': {
        return (
          <PasskeyErrorContent
            suggestKeychainSettings
            title={loc.walletCloudBackupError.errorDeletingPasskey.title}
            footerLines={[loc.walletCloudBackupError.errorDeletingPasskey.deletedPasskeyPossibility]}
          />
        );
      }
      case 'passkeyErrorInactive': {
        return (
          <PasskeyErrorContent
            title={loc.walletCloudBackupError.errorInactive.title}
            footerLines={[loc.walletCloudBackupError.errorInactive.subtitle, loc.walletCloudBackupError.errorInactive.description]}
          />
        );
      }
      case 'passkeyErrorUserCanceledRegistration': {
        return (
          <PasskeyErrorContent
            title={loc.walletCloudBackupError.userCanceledBackup.title}
            footerLines={[loc.walletCloudBackupError.userCanceledBackup.description]}
          />
        );
      }
      case 'passkeyErrorWritingWrongDevice':
        return (
          <PasskeyErrorContent
            suggestSupport
            showDescripton
            suggestKeychainSettings
            title={loc.walletCloudBackupError.errorCreatingBackup.title}
            footerLines={[loc.walletCloudBackupError.errorCreatingBackup.tryAgainFormatted]}
          />
        );
      default:
        return null;
    }
  }, [type]);

  const buttonProps: FloatingBottomButtonsProps = useMemo(() => {
    switch (type) {
      case 'passkeyErrorReading':
      case 'passkeyErrorWriting':
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
