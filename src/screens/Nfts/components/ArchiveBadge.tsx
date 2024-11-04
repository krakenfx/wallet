import type { StyleProp, ViewStyle } from 'react-native';

import { BlurView } from '@react-native-community/blur';
import differenceInDays from 'date-fns/differenceInDays';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { useTheme } from '@/theme/themes';

import loc from '/loc';

interface Props {
  archiveDate: Date;
  absolutePosition?: boolean;
  style?: StyleProp<ViewStyle>;
}

const PLURAL_DAYS = 2;

export const ArchiveBadge = ({ archiveDate, style }: Props) => {
  const { colors } = useTheme();

  const title = useMemo(() => {
    const days = differenceInDays(new Date(), archiveDate);
    return days < PLURAL_DAYS ? loc.nftCollection.archivedOneDayInfo : loc.formatString(loc.nftCollection.archivedDaysInfo, { days });
  }, [archiveDate]);

  return (
    <View style={style}>
      <View style={styles.badgeWrapper}>
        <BlurView
          style={{ ...StyleSheet.absoluteFillObject, backgroundColor: colors.dark15 }}
          blurAmount={25}
          blurRadius={25}
          blurType="light"
          reducedTransparencyFallbackColor={colors.dark15}
        />
        <View style={styles.badge}>
          <SvgIcon size={16} name="archive" style={styles.icon} />
          <Label type="boldCaption1">{title}</Label>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeWrapper: {
    borderRadius: 37,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
});
