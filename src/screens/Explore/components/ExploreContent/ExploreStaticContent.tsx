import { StyleSheet } from 'react-native';

import { DefiDiscoveryPreview } from '@/components/DefiDiscoveryPreview';
import { SvgIcon } from '@/components/SvgIcon';
import { useFeatureFlag } from '@/unencrypted-realm/featureFlags/useFeatureFlag';

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
  const [isEarnEnabled] = useFeatureFlag('earnEnabled');

  if (isEarnEnabled && index === 0 && variant === 'Hero') {
    return (
      <ContentWrapper marker="defi_discovery_preview">
        <ExploreText
          body={loc.explore.earnBody}
          style={styles.textContent}
          title={loc.explore.earnTitle}
          titleIcon={<SvgIcon size={24} name="chevron-right" color="light100" />}
        />
        <DefiDiscoveryPreview />
      </ContentWrapper>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  textContent: {
    paddingHorizontal: Space.s1,
    paddingBottom: Space.s1,
  },
});
