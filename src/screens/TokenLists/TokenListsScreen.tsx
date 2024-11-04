import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/BottomSheet';
import { CardWarning } from '@/components/CardWarning';
import { KeyboardAvoider } from '@/components/Keyboard';
import { ModalNavigationHeader } from '@/components/ModalNavigationHeader';

import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useDeafultHeaderHeight } from '@/hooks/useDefaultHeaderHeight';
import { REPUTATION, useReputation } from '@/hooks/useReputation';
import type { NavigationProps } from '@/Routes';
import { Routes } from '@/Routes';
import { EXPLAINER_CONTENT_TYPES } from '@/screens/Explainer';
import { navigationStyle } from '@/utils/navigationStyle';

import { TokenListsDescription } from './components/TokenListsDescription';
import { TokenListsList } from './components/TokenListsList';

import loc from '/loc';

export type TokenListsParams = {
  assetId: string;
};

export const TokenListsScreen = ({ navigation, route }: NavigationProps<'TokenLists'>) => {
  const reputation = useReputation(route.params.assetId);

  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);
  const headerHeight = useDeafultHeaderHeight();
  const { height } = useSafeAreaFrame();
  const { top } = useSafeAreaInsets();

  return (
    <BottomSheet {...bottomSheetProps} snapPoints={[height - headerHeight - top]}>
      <ModalNavigationHeader onClosePress={close} style={styles.navigationHeader} />
      <KeyboardAvoider style={styles.keyboardAvoider}>
        <View style={styles.headerContainer}>
          <TokenListsDescription />
        </View>
        {reputation === REPUTATION.BLACKLISTED && (
          <CardWarning
            title={loc.tokenLists.likelySpam}
            description={loc.tokenLists.likelySpamDescription}
            buttonText={loc.tokenLists.likelySpamHelp}
            onPress={() => {
              navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.BLACKLISTED });
            }}
            style={styles.cardWarning}
            type="negative"
          />
        )}
        {reputation === REPUTATION.UNVERIFIED && (
          <CardWarning
            title={loc.tokenLists.unverified}
            description={loc.tokenLists.unverifiedDescription}
            buttonText={loc.tokenLists.help}
            onPress={() => {
              navigation.navigate(Routes.Explainer, { contentType: EXPLAINER_CONTENT_TYPES.TOKEN_LISTS });
            }}
            style={styles.cardWarning}
            type="warning"
          />
        )}
        <TokenListsList assetId={route.params.assetId} />
      </KeyboardAvoider>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  navigationHeader: {
    justifyContent: 'flex-end',
  },
  headerContainer: {
    paddingBottom: 32,
    marginHorizontal: 20,
  },
  cardWarning: {
    marginHorizontal: 12,
  },
  keyboardAvoider: {
    flex: 1,
  },
});

TokenListsScreen.navigationOptions = navigationStyle({
  animation: 'none',
  presentation: 'transparentModal',
  gestureEnabled: true,
  headerShown: false,
  headerTransparent: true,
  headerLeft: undefined,
  title: '',
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
