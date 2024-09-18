import { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { BottomSheetModal, BottomSheetModalRef } from '@/components/BottomSheet';
import { FloatingBottomButtons, FloatingBottomButtonsProps } from '@/components/FloatingBottomButtons';

import { Label } from '@/components/Label';

import { PasskeyErrorContent } from './PasskeyErrorContent';

import loc from '/loc';

export type PasskeyErrorType =
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
          />
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
  }, [type]);

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
