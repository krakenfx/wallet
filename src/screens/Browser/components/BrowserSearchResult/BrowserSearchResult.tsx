import { Image, StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

import { useSearchContext } from '../../context/SearchContext';

export const BrowserSearchResult = () => {
  const { colors } = useTheme();

  const { searchValue, hideSearch, searchWithGoogle } = useSearchContext();

  return (
    <View style={styles.container}>
      <Touchable style={styles.resultRow} onPress={searchWithGoogle}>
        <View style={[styles.iconContainer, { backgroundColor: colors.purple_40 }]}>
          <Image source={require('@/assets/images/google/googleIcon.png')} />
        </View>

        <Label style={styles.label} type="regularBody" color="light100" numberOfLines={1} ellipsizeMode="tail">
          Look up “{searchValue}”
        </Label>
      </Touchable>

      <Touchable style={styles.clearSearchContainer} onPress={hideSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    paddingVertical: 10,
    paddingHorizontal: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  resultRow: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 16,
  },
  label: {
    width: '90%',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    width: 32,
    borderRadius: 20,
  },
  clearSearchContainer: {
    height: '100%',
  },
});
