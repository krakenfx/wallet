import { StyleSheet } from 'react-native';

import { DepositOptionsCarousel } from '@/components/DepositOptionsCarousel';

import { Sizes } from '../../ExploreScreen.constants';

import { ContentWrapper } from '../ExploreContent';
import { ExploreText } from '../ExploreText';

import loc from '/loc';

const { Space } = Sizes;
type Props = {
  index: number;
  variant: string;
};

export const ExploreStaticContent = ({ index, variant }: Props) => {
  if (index === 0 && variant === 'Hero') {
    return (
      <ContentWrapper marker="defi_discovery_preview">
        <ExploreText body={loc.explore.earnBody} style={styles.textContent} title={loc.explore.earnTitle} />
        <DepositOptionsCarousel />
      </ContentWrapper>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  textContent: {
    paddingBottom: Space.s1AndThird,
  },
});
