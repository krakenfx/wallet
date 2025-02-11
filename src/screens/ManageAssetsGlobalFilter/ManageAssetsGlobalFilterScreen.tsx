import type React from 'react';

import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/BottomSheet';
import { SvgIcon } from '@/components/SvgIcon';
import type { NavigationProps } from '@/Routes';
import { useTheme } from '@/theme/themes';
import { navigationStyle } from '@/utils/navigationStyle';

export type ManageAssetsGlobalFilterParams = {
  content: React.ReactNode;
};

export const ManageAssetsGlobalFilterScreen = ({ navigation, route }: NavigationProps<'ManageAssetsGlobalFilter'>) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <BottomSheet
      enableDynamicSizing
      animateOnMount={false}
      detached={true}
      bottomInset={insets.bottom + 30}
      dismissible
      onBackdropPress={navigation.goBack}
      onDismiss={navigation.goBack}
      handleStyle={styles.handle}
      style={styles.modal}>
      <BottomSheetScrollView contentContainerStyle={styles.container}>
        {route.params.content}
        <SvgIcon name="close" size={32} onPress={navigation.goBack} style={[styles.closeIcon, { backgroundColor: theme.colors.light15 }]} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

ManageAssetsGlobalFilterScreen.navigationOptions = navigationStyle({
  animationDuration: 2000,
  animation: 'fade',
  headerShown: false,
  presentation: 'transparentModal',
  contentStyle: {
    backgroundColor: 'transparent',
  },
});

const styles = StyleSheet.create({
  modal: {
    borderRadius: 48,
    borderBottomRightRadius: 48,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  handle: {
    display: 'none',
  },
  container: {
    paddingVertical: 35,
    paddingHorizontal: 12,
  },
  closeIcon: {
    width: 64,
    height: 64,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderRadius: 48,
    marginTop: 28,
  },
});
