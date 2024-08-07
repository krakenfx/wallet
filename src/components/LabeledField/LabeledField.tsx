import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

interface LabeledFieldProps {
  label: string;
  children: React.ReactNode | React.ReactNode[];
  right?: React.ReactNode;
  testID?: string;
}

export const LabeledField = ({ label, children, right, testID }: LabeledFieldProps) => {
  const content = (
    <>
      <Label type="boldCaption1" color="light50" style={right ? undefined : styles.heading}>
        {label}
      </Label>
      {children}
    </>
  );

  if (right) {
    return (
      <View style={styles.wrapper} testID={testID}>
        <View style={styles.contentContainer}>{content}</View>
        {right}
      </View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    marginTop: 16,
  },
  contentContainer: {
    flex: 1,
    marginRight: 16,
  },
  heading: {
    marginBottom: 4,
    marginTop: 16,
  },
});
