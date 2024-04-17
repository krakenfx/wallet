import React, { ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { ReputationTagBlacklisted, ReputationTagUnverified } from '@/components/Reputation';
import { REPUTATION } from '@/hooks/useReputation';
import { RealmSettingsKey, useSettingsMutations } from '@/realm/settings';
import { useFilterInBlacklistedAssets } from '@/realm/settings/useFilterInBlacklistedAssets';
import { useFilterInUnverifiedAssets } from '@/realm/settings/useFilterInUnverifiedAssets';

import { ReputationFilterItem } from './ReputationFilterItem';

import loc from '/loc';

type UIFilterData = { id: REPUTATION; uiLabel: ReactElement; icon: ReactElement };

const UI_FILTER_DATA: UIFilterData[] = [
  { id: REPUTATION.UNVERIFIED, uiLabel: <Label color="yellow500">{loc.reputation.unverified}</Label>, icon: <ReputationTagUnverified /> },
  { id: REPUTATION.BLACKLISTED, uiLabel: <Label color="red400">{loc.reputation.likelySpam}</Label>, icon: <ReputationTagBlacklisted /> },
];

export const ReputationFilter = () => {
  const { setSettings } = useSettingsMutations();
  const filterInUnverifiedAssets = useFilterInUnverifiedAssets();
  const filterInBlacklistedAssets = useFilterInBlacklistedAssets();
  const idToSetting: Record<string, { value: boolean; settingsKey: RealmSettingsKey }> = useMemo(
    () => ({
      [REPUTATION.UNVERIFIED]: { value: filterInUnverifiedAssets, settingsKey: RealmSettingsKey.filterInUnverifiedAssets },
      [REPUTATION.BLACKLISTED]: { value: filterInBlacklistedAssets, settingsKey: RealmSettingsKey.filterInBlacklistedAssets },
    }),
    [filterInUnverifiedAssets, filterInBlacklistedAssets],
  );

  return (
    <>
      <Label type="boldTitle1" style={styles.header}>
        {loc.coins.showAssets}
      </Label>
      <View style={styles.filters}>
        {UI_FILTER_DATA.map(({ id, uiLabel, icon }) => {
          const { settingsKey, value } = idToSetting[id];
          const handleToggle = () => setSettings(settingsKey, !value);

          return (
            <ReputationFilterItem
              content={
                <View style={styles.filterItemContent}>
                  {uiLabel}
                  {icon}
                </View>
              }
              value={value}
              onToggle={handleToggle}
              key={id}
            />
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  filters: {
    gap: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  filterItemContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    gap: 8,
  },
});
