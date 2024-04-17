import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export type Props = {
  text: string;
  onPress: () => void;
  isSelected: boolean;
};

const RoundText: React.FC<Props> = ({ text, onPress, isSelected = false }) => {
  return (
    <Pressable style={({ pressed }) => [pressed || isSelected ? styles.selected : styles.default, styles.container]} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: '#5302FF',
  },
  default: {
    backgroundColor: 'rgba(255, 250, 250, 0.1)',
  },
  text: {
    marginVertical: 11,
    marginHorizontal: 24,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default RoundText;
