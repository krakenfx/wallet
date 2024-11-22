import { useNavigation } from '@react-navigation/native';

import { StyleSheet } from 'react-native';

import { CardWarning } from '@/components/CardWarning';
import { Label } from '@/components/Label';

import { SvgIcon } from '@/components/SvgIcon';

import { Routes } from '@/Routes';
import { EXPLAINER_CONTENT_TYPES } from '@/screens/Explainer';

import { ReputationAccordion } from './ReputationAccordion';

import loc from '/loc';

export const BlackListedReputationAccordion = () => {
  const navigation = useNavigation();

  return (
    <ReputationAccordion
      leftIcon={<SvgIcon name="warning-filled" color="red400" size={16} />}
      leftLabelColor="red400"
      infoLabel={loc.tokenLists.likelySpam}
      rightLabelElementClosed={
        <Label type="regularBody" color="red400">
          {loc.tokenLists.likelySpamUseCaution}
        </Label>
      }
      rightLabelElementOpened={loc.marketData.showLess}
      isWarning>
      <CardWarning
        description={loc.tokenLists.likelySpamDescription}
        buttonText={loc.tokenLists.likelySpamHelp}
        onPress={() => {
          navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.BLACKLISTED });
        }}
        style={styles.cardWarning}
        type="negative"
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
