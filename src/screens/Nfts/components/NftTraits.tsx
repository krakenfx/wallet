import type React from 'react';

import format from 'date-fns/format';
import { chunk, keyBy, words } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import type { RealmNft } from '@/realm/nfts';
import { useTheme } from '@/theme/themes';

import { NFTLinksItem } from './NFTLinksItem';

import { capitalizeFirstLetter } from '/helpers/capitalizeFirstLetter';
import loc from '/loc';

const DEFAULT_TRAIT_COUNT = 6;

const TRAIT_CREATED_DATE = 'Created Date';
const TRAIT_EXPIRATION_DATE = 'Expiration Date';

export const NftTraits: React.FC<{ nft: RealmNft }> = ({ nft }) => {
  const [showMoreTraits, setShowMoreTraits] = useState(false);

  const onShowMorePress = useCallback(() => {
    setShowMoreTraits(showMore => !showMore);
  }, []);

  const { colors } = useTheme();

  const traits = useMemo(() => {
    if (!nft?.traits || nft.traits.length === 0) {
      return;
    }

    if (nft.metadata.isENS) {
      const dates = keyBy(
        nft.traits
          .filter(t => t.traitType === TRAIT_CREATED_DATE || t.traitType === TRAIT_EXPIRATION_DATE)
          .map(t => ({
            name: words(t.traitType).at(0)?.toLowerCase(),
            value: !isNaN(Number(t.value)) ? format(new Date(Number(t.value)), 'dd LLL yyyy') : t.value,
          })),
        'name',
      );

      return (
        <>
          <NFTLinksItem label={loc.nftView.ens.traits.created} content={dates.created?.value} isFirst />
          <NFTLinksItem label={loc.nftView.ens.traits.expiration} content={dates.expiration?.value} isLast />
        </>
      );
    }

    return (
      <>
        {chunk(showMoreTraits ? nft.traits : nft.traits.slice(0, DEFAULT_TRAIT_COUNT), 2).map(([first, second], i) => (
          <View style={styles.traitsRow} key={`row_${i}`}>
            {[first, second].map((trait, row) => {
              if (!trait) {
                return <View style={styles.traitWrapper} key={`row-${row}`} />;
              }

              return (
                <View
                  style={[styles.traitWrapper, { backgroundColor: colors.dark25 }]}
                  key={trait.traitType + trait.value + row}
                  testID={`NftTraits-${trait.traitType.toLowerCase()}`}>
                  <Label type="boldMonospace" numberOfLines={1} color="light75">
                    {trait.traitType.toUpperCase().replace('_', ' ')}
                  </Label>
                  <Label type="regularBody" numberOfLines={1}>
                    {capitalizeFirstLetter(trait.value)}
                  </Label>
                </View>
              );
            })}
          </View>
        ))}
        {nft.traits.length > DEFAULT_TRAIT_COUNT ? (
          <Button
            testID="NftTraitsToggleMore"
            onPress={onShowMorePress}
            style={styles.traitsShowMore}
            size="large"
            text={showMoreTraits ? loc.nftView.show_less : loc.nftView.show_more}
          />
        ) : null}
      </>
    );
  }, [colors.dark25, nft.metadata.isENS, nft.traits, onShowMorePress, showMoreTraits]);

  return (
    <>
      {traits ? (
        <Label type="boldTitle2" style={styles.sectionHeading} testID="NftTraitsHeader">
          {loc.nftView.properties}
        </Label>
      ) : null}
      {traits}
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeading: {
    marginTop: 32,
    marginBottom: 24,
  },
  traitsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginBottom: 8,
  },
  traitWrapper: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 8,
    height: 75,
    marginHorizontal: 4,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  traitLabel: {
    flex: 1,
  },
  traitsShowMore: {
    marginTop: 24,
  },
});
