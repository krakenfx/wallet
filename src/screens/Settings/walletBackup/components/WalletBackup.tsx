import type React from 'react';

import { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { FloatingBottomButtons } from '@/components/FloatingBottomButtons';
import { Label } from '@/components/Label';
import { SeedDisplay, useSeedPhrase } from '@/components/SeedDisplay';
import { OnboardingHeader } from '@/screens/Onboarding/components/OnboardingHeader';

import loc from '/loc';
import SensitiveClipboard from '/modules/sensitive-clipboard';

interface Props {
  onContinue: () => void;
  seedVisible?: boolean;
}

export const WalletBackup = ({ onContinue, seedVisible }: Props) => {
  const { seed, isSeedVisible, onSeedReveal } = useSeedPhrase(seedVisible);

  const stickyFooter = useCallback(
    (props: { seedVisible: boolean; seed?: string }) => {
      return <StickyFooter {...props} onContinue={onContinue} />;
    },
    [onContinue],
  );

  return (
    <SeedDisplay
      seed={seed}
      isSeedVisible={isSeedVisible}
      onSeedReveal={onSeedReveal}
      testID="WalletBackupSeedDisplay"
      style={styles.seedDisplay}
      stickyHeader={<StickyHeader />}
      stickyFooter={stickyFooter}
    />
  );
};

const StickyHeader = () => (
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
);

interface StickyFooterProps {
  seedVisible: boolean;
  seed?: string;
  onContinue: () => void;
}

const StickyFooter: React.FC<StickyFooterProps> = ({ seedVisible, seed, onContinue }) => (
  <FloatingBottomButtons
    noAbsolutePosition
    style={styles.buttons}
    primary={{
      text: loc.onboarding_backup.continue,
      testID: 'NextButton',
      onPress: onContinue,
    }}
    secondary={{
      disabled: !seedVisible || !seed,
      text: loc._.copy,
      testID: 'CopyButton',
      onPress: () => !!seed && SensitiveClipboard.setString(seed),
      icon: 'copy',
    }}
  />
);

const styles = StyleSheet.create({
  seedDisplay: {
    margin: 12,
  },
  buttons: {
    paddingHorizontal: 12,
  },
});
