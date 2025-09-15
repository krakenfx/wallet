import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';

import type { BottomSheetModalRef } from '@/components/BottomSheet';
import { BottomSheetModal } from '@/components/BottomSheet';
import { runAfterUISync } from '@/utils/runAfterUISync';

import { LockScreen } from './LockScreen';

import type { useLockout } from './hooks/useLockout';
import type { LockScreenRef } from './LockScreen';

import loc from '/loc';

export type PasswordProtectionModalRef = LockScreenRef & Pick<BottomSheetModalRef, 'present' | 'dismiss'>;

type Props = {
  checkPassword: (password: string) => void;
  onDismiss: () => void;
  lockout: ReturnType<typeof useLockout>;
};

export type Rationale = 'createWallet' | 'sign' | 'viewPhrase' | 'getXPub' | 'updateStorage';

export const PasswordProtectionSheet = forwardRef<PasswordProtectionModalRef & LockScreenRef, Props>(({ checkPassword, onDismiss, lockout }, ref) => {
  const modalRef = useRef<BottomSheetModalRef>(null);
  const lockScreenRef = useRef<LockScreenRef>(null);
  const [description, setDescription] = useState('');

  const getModalDescription = (rationale: Rationale) => {
    switch (rationale) {
      case 'createWallet':
        return loc.passwordProtection.rationaleCreateWallet;
      case 'sign':
        return loc.passwordProtection.rationaleSignTransaction;
      case 'viewPhrase':
        return loc.passwordProtection.rationaleSeeRecoveryPhrase;
      case 'getXPub':
        return loc.passwordProtection.rationaleGetXPub;
      case 'updateStorage':
        return loc.passwordProtection.rationaleUpdateStorage;
    }
  };

  const present = useCallback((rationale: Rationale) => {
    setDescription(getModalDescription(rationale));
    runAfterUISync(() => {
      modalRef.current?.present();
    });
  }, []);

  const sheetMethods = useMemo(
    () => ({
      present,
      dismiss: () => modalRef.current?.dismiss(),
      showError: () => lockScreenRef.current?.showError(),
    }),
    [present],
  );

  useImperativeHandle(ref, () => sheetMethods, [sheetMethods]);

  return (
    <BottomSheetModal keyboardBehavior="fillParent" snapPoints={['100%']} onDismiss={onDismiss} ref={modalRef}>
      <LockScreen
        ref={lockScreenRef}
        onConfirm={checkPassword}
        header={loc.passwordProtection.enterPassword}
        description={description}
        buttonText={loc.passwordProtection.unlock}
        headerErrorText={loc.passwordProtection.wrongPassword}
        descriptionErrorText={loc.passwordProtection.wrongPasswordDescription}
        buttonErrorText={loc.passwordProtection.passwordIncorrect}
        isLocked={lockout.isLocked}
        disabled={!lockout.isReady}
      />
    </BottomSheetModal>
  );
});
