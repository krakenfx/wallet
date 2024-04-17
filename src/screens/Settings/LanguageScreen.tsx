import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { GradientScreenView } from '@/components/Gradients';
import { Label } from '@/components/Label';
import navigationStyle from '@/components/navigationStyle';
import { ToggleRow } from '@/components/ToggleRow';
import { useHeaderTitle } from '@/hooks/useHeaderTitle';
import { useLocalStateUpdate } from '@/hooks/useLocalStateUpdate';
import { useLanguage, useLanguageSetMutation } from '@/realm/settings';

import { languages } from '../../../loc/languages';

import loc from '/loc';

export const LanguageScreen = () => {
  const language = useLanguage();
  const { setLanguage } = useLanguageSetMutation();

  const [localTag, updateLanguage] = useLocalStateUpdate(language, setLanguage);

  useHeaderTitle(loc.settings.language);

  return (
    <GradientScreenView>
      <ScrollView contentContainerStyle={styles.container}>
        {languages.map(item => {
          const selected = localTag === item.tag;
          return (
            <ToggleRow
              key={item.tag}
              testID={item.label + (selected ? '-Selected' : '')}
              onPress={() => {
                updateLanguage(item.tag);
              }}
              selected={selected}>
              <Label>{item.label}</Label>
            </ToggleRow>
          );
        })}
      </ScrollView>
    </GradientScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
  },
});

LanguageScreen.navigationOptions = navigationStyle({ title: loc.settings.language, headerTransparent: true });
