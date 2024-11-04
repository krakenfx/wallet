import { useHeaderHeight } from '@react-navigation/elements';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';

import { ZoomInEasyUp } from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { Label } from '@/components/Label';
import { LargeHeaderPage } from '@/components/LargeHeaderPage';
import { ProgressBar } from '@/components/ProgressBar';
import { SvgIcon } from '@/components/SvgIcon';
import { Tooltip } from '@/components/Tooltip';
import { useBottomElementSpacing } from '@/hooks/useBottomElementSpacing';
import { useWalletBackupSettings } from '@/hooks/useWalletBackupSettings';

import { BackupMethodSelector } from './BackupMethodSelector';

import loc from '/loc';

type Props = {
  onCloudBackupSelected: () => void;
  onManualBackupSelected: () => void;
  testID?: string;
  onSkip: () => void;
  onShowExplainer: () => void;
};

const TOOLTIP_DELAY_MS = 1800;
const HIGHLIGHT_DELAY_MS = 800;

export const BackupMethodSelectionView: React.FC<Props> = ({ onCloudBackupSelected, onManualBackupSelected, onSkip, onShowExplainer, testID }) => {
  const { isAnyBackupCompleted, isCloudBackupCompleted, isManualBackupCompleted } = useWalletBackupSettings();
  const [isManualBackupHightlighted, setIsManualBackupHightlighted] = useState(false);
  const [isCloudBackupHightlighted, setIsCloudBackupHightlighted] = useState(false);
  const [recoverabilityLevel, setRecoverabilityLevel] = useState(1);

  const scrollRef = useRef<ScrollView>(null);

  const scrollToEnd = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd();
    }, TOOLTIP_DELAY_MS);
  };
  const updateProgressBar = () => {
    setTimeout(() => {
      setRecoverabilityLevel(2);
    }, HIGHLIGHT_DELAY_MS);
  };

  useFocusEffect(
    useCallback(() => {
      if (isCloudBackupCompleted && !isManualBackupCompleted) {
        setIsManualBackupHightlighted(true);
        scrollToEnd();
        updateProgressBar();
      } else if (isManualBackupCompleted && !isCloudBackupCompleted) {
        setIsCloudBackupHightlighted(true);
        scrollToEnd();
        updateProgressBar();
      }
    }, [isCloudBackupCompleted, isManualBackupCompleted]),
  );

  const renderTooltip = (text: string) => (
    <Tooltip entering={ZoomInEasyUp.duration(450).delay(TOOLTIP_DELAY_MS)} containerStyle={styles.tooltip}>
      <Label color="light75" type="regularBody">
        {text}
      </Label>
    </Tooltip>
  );

  const selectors = useMemo(() => {
    const children = [
      <BackupMethodSelector
        key="cloudBackupSelector"
        icon={<Image source={require('@/assets/images/common/iCloud.png')} />}
        onPress={onCloudBackupSelected}
        title={isCloudBackupCompleted ? loc.walletBackupSelection.backupWithICloudCompleted : loc.walletBackupSelection.backupWithICloud}
        subtitle={loc.walletBackupSelection.iCloudDescLong}
        subtitleShort={loc.walletBackupSelection.iCloudDescShort}
        showCompletionState={isAnyBackupCompleted}
        completed={isCloudBackupCompleted}
        highlighted={isCloudBackupHightlighted}
        highlighDelayMs={HIGHLIGHT_DELAY_MS}
        centerIcon
      />,
      <BackupMethodSelector
        testID="ManualBackupSelector"
        key="manualBackupSelector"
        icon={<IconButton size={24} name="pencil" style={[styles.iconSize, styles.iconRadius]} containerStyle={styles.iconRadius} />}
        onPress={onManualBackupSelected}
        title={isManualBackupCompleted ? loc.walletBackupSelection.backupManuallyCompleted : loc.walletBackupSelection.backupManually}
        subtitle={loc.walletBackupSelection.manualBackupDescLong}
        subtitleShort={isManualBackupCompleted ? loc.walletBackupSelection.manualBackupDescShortCompleted : loc.walletBackupSelection.manualBackupDescShort}
        showCompletionState={isAnyBackupCompleted}
        completed={isManualBackupCompleted}
        highlighted={isManualBackupHightlighted}
        highlighDelayMs={HIGHLIGHT_DELAY_MS}
        centerIcon
      />,
    ];

    return isCloudBackupHightlighted ? children.reverse() : children;
  }, [
    isAnyBackupCompleted,
    isCloudBackupCompleted,
    isCloudBackupHightlighted,
    isManualBackupCompleted,
    isManualBackupHightlighted,
    onCloudBackupSelected,
    onManualBackupSelected,
  ]);

  const paddingBottom = useBottomElementSpacing();

  const content = useMemo(
    () => (
      <>
        <View style={styles.selectors}>
          {selectors}
          {isManualBackupHightlighted && renderTooltip(loc.walletBackupSelection.tooltip.manual)}
          {isCloudBackupHightlighted && renderTooltip(loc.walletBackupSelection.tooltip.iCloud)}
        </View>
        {isAnyBackupCompleted && (
          <View style={styles.footer}>
            <View style={[styles.row, styles.progressBarDesc]}>
              <Label type="boldBody"> {loc.walletBackupSelection.recoverability.title}</Label>
              <View style={styles.row}>
                <Label type="regularBody" color="yellow600">
                  {loc.walletBackupSelection.recoverability.desc}
                </Label>
                <SvgIcon name="info-circle" size={22} style={styles.infoIcon} color="light50" onPress={onShowExplainer} />
              </View>
            </View>
            <ProgressBar totalBars={3} currentBar={recoverabilityLevel} activeColor="yellow600" containerStyle={styles.progressBar} />
            <Button size="large" text={loc.walletBackupSelection.skipButton} onPress={onSkip} />
          </View>
        )}
      </>
    ),
    [isAnyBackupCompleted, isCloudBackupHightlighted, isManualBackupHightlighted, onShowExplainer, onSkip, recoverabilityLevel, selectors],
  );

  const marginTop = useHeaderHeight();

  const labels = useMemo(() => {
    if (!isAnyBackupCompleted) {
      return {
        title: loc.walletBackupSelection.titleWithSubtitle,
        caption: loc.walletBackupSelection.prompt,
      };
    }
    if (isCloudBackupCompleted) {
      return {
        title: loc.walletBackup.secondaryBackup.title,
        caption: loc.walletBackup.secondaryBackup.manual,
      };
    }
    if (isManualBackupCompleted) {
      return {
        title: loc.walletBackup.secondaryBackup.title,
        caption: loc.walletBackup.secondaryBackup.iCloud,
      };
    }
  }, [isAnyBackupCompleted, isCloudBackupCompleted, isManualBackupCompleted]);

  return (
    <ScrollView style={{ marginTop }} ref={scrollRef} bounces={false} contentContainerStyle={[styles.scrollContent, { paddingBottom }]}>
      {!isAnyBackupCompleted ? (
        <LargeHeaderPage
          largeHeaderStyle={[styles.noMarginTop, styles.largeHeader]}
          style={styles.noMarginTop}
          testID={testID}
          title={loc.walletBackupSelection.title}
          subtitle={loc.walletBackupSelection.subtitle}
          text={loc.walletBackupSelection.prompt}
          caption={loc.walletBackupSelection.caption}>
          {content}
        </LargeHeaderPage>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.backupLabels}>
            <Label type="boldDisplay4">{labels?.title}</Label>
            <Label type="regularBody" color="light75">
              {labels?.caption}
            </Label>
          </View>
          {content}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  selectors: {
    marginBottom: 24,
    paddingHorizontal: 12,
    gap: 16,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  noMarginTop: {
    marginTop: 0,
  },
  contentContainer: {
    flex: 1,
  },
  iconSize: {
    width: 36,
    height: 36,
  },
  iconRadius: {
    borderRadius: 12,
  },
  tooltip: {
    marginLeft: 24,
    zIndex: -1,
  },
  infoIcon: {
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
  },
  progressBarDesc: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    marginBottom: 36,
    marginTop: 16,
  },
  backupLabels: {
    paddingHorizontal: 24,
    marginVertical: 24,
    gap: 12,
  },
  largeHeader: {
    marginBottom: 24,
  },
  footer: {
    margin: 16,
  },
});
