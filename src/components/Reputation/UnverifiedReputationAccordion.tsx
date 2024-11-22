import { useNavigation } from '@react-navigation/native';

import { StyleSheet } from 'react-native';

import { CardWarning } from '@/components/CardWarning';
import { Label } from '@/components/Label';

import { SvgIcon } from '@/components/SvgIcon';

import { Routes } from '@/Routes';
import { EXPLAINER_CONTENT_TYPES } from '@/screens/Explainer';

import { ReputationAccordion } from './ReputationAccordion';

import loc from '/loc';

export const UnverifiedReputationAccordion = () => {
  const navigation = useNavigation();

  return (
    <ReputationAccordion
      leftIcon={<SvgIcon name="error" color="yellow500" size={16} />}
      leftLabelColor="yellow500"
      infoLabel={loc.tokenLists.unverified}
      rightLabelElementClosed={
        <Label type="regularBody" color="light75">
          {loc.tokenLists.unverifiedWarning}
        </Label>
      }
      rightLabelElementOpened={loc.marketData.showLess}>
      <CardWarning
        description={loc.tokenLists.unverifiedDescription}
        buttonText={loc.tokenLists.unverifiedButtonLink}
        onPress={() => {
          navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.UNVERIFIED_LISTS });
        }}
        style={styles.cardWarning}
        type="warning"
        hideLeftIcon
      />
    </ReputationAccordion>
  );
};

const styles = StyleSheet.create({
  cardWarning: {
    marginHorizontal: 12,
    marginBottom: 8,
  },
});
