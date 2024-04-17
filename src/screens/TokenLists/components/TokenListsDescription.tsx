import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { Routes } from '@/Routes';
import { EXPLAINER_CONTENT_TYPES } from '@/screens/Explainer';

import loc from '/loc';

export const TokenListsDescription = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Label type="boldTitle2">{loc.tokenLists.tokenLists}</Label>
      <Label type="regularBody" color="light75" style={styles.subText}>
        {loc.tokenLists.description}
      </Label>

      <Button
        size="small"
        text={loc.tokenLists.help}
        onPress={() => {
          navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.TOKEN_LISTS });
        }}
        disabled={false}
        style={styles.help}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
    textAlign: 'center',
  },
  subText: {
    textAlign: 'center',
  },
  help: {
    marginTop: 4,
  },
});
