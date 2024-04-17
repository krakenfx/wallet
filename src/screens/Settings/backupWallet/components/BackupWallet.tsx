import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { SeedDisplay } from '@/components/SeedDisplay';
import { OnboardingHeader } from '@/screens/Onboarding/components/OnboardingHeader';

import loc from '/loc';
import SensitiveClipboard from '/modules/sensitive-clipboard';

interface Props {
  onContinue: () => void;
  seedVisible?: boolean;
}

export const BackupWallet = ({ onContinue, seedVisible }: Props) => {
  const header = useCallback(
    () => (
      <OnboardingHeader
        title={loc.onboarding_backup.title}
        caption={loc.formatString(loc.onboarding_backup.caption, {
          neverShare: (
            <Label type="boldTitle1" color="light50">
              {loc.onboarding.never_share}
            </Label>
          ),
        })}
      />
    ),
    [],
  );

  const footer = useCallback(
    (canCopy: boolean, seed?: string) => (
      <FloatingBottomButtons
        noAbsolutePosition
        style={styles.buttons}
        primary={{
          text: loc.onboarding_backup.continue,
          testID: 'NextButton',
          onPress: onContinue,
        }}
        secondary={{
          disabled: !canCopy || !seed,
          text: loc._.copy,
          testID: 'CopyButton',
          onPress: () => !!seed && SensitiveClipboard.setString(seed),
          icon: 'copy',
        }}
      />
    ),
    [onContinue],
  );

  return <SeedDisplay testID="BackupWalletSeedDisplay" style={styles.seedDisplay} header={header} footer={footer} initiallyRevealed={seedVisible} />;
};

const styles = StyleSheet.create({
  seedDisplay: {
    marginVertical: 12,
  },
  buttons: {
    paddingHorizontal: 12,
  },
});
