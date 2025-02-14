import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

export type TransactionRowProps = {
  amounts?: JSX.Element;
  containerStyle?: StyleProp<ViewStyle>;
  icon?: JSX.Element;
  subtitle?: JSX.Element;
  title?: JSX.Element;
  testID?: string;
};

export const TransactionRow = ({ amounts, containerStyle, icon, subtitle, title, testID }: TransactionRowProps) => {
  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      <View style={styles.startContainer}>
        {icon ? icon : null}
        <View style={styles.column}>
          {title ? title : null}
          {subtitle ? subtitle : null}
        </View>
      </View>
      {amounts ? <View style={styles.endContainer}>{amounts}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
  },
  startContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
    gap: 8,
  },
  endContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    maxWidth: '40%',
  },
  column: {
    marginRight: 24,
  },
});
