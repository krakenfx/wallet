import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer';
import { Input } from '@/components/Input';
import { KeyboardAvoider } from '@/components/Keyboard';
import { Label } from '@/components/Label';
import { ModalNavigationHeader } from '@/components/ModalNavigationHeader';
import { useBottomSheetScreenProps } from '@/hooks/useBottomSheetScreenProps';
import { useTransactionNotes, useTransactionNotesMutations } from '@/realm/transactionNotes';
import type { NavigationProps } from '@/Routes';
import { navigationStyle } from '@/utils/navigationStyle';

import loc from '/loc';

export interface EditNoteParams {
  walletId: string;
  transactionId: string;
  defaultNotes: string;
}

export const EditNoteScreen = ({
  navigation,
  route: {
    params: { walletId, transactionId, defaultNotes },
  },
}: NavigationProps<'EditNote'>) => {
  const { addTransactionNotes } = useTransactionNotesMutations();
  const notesForTransaction = useTransactionNotes(walletId, transactionId);
  const [note, setNote] = useState(notesForTransaction ?? defaultNotes);

  const { bottomSheetProps, close } = useBottomSheetScreenProps(navigation);

  const saveNotes = useCallback(() => {
    addTransactionNotes(walletId, transactionId, note.trim());
    close();
  }, [addTransactionNotes, walletId, transactionId, note, close]);

  return (
    <BottomSheet {...bottomSheetProps} snapPoints={['100%']}>
      <ModalNavigationHeader title={loc.transactionDetails.notes} onClosePress={close} />
      <BottomSheetScrollView style={styles.scrollView}>
        <KeyboardAvoider style={styles.container}>
          <Input multiline inputStyle={styles.input} onChangeText={setNote} defaultValue={note} />
          <Label style={styles.subText} type="regularCaption1" color="light75">
            {loc.transactionDetails.notesCaption}
          </Label>
        </KeyboardAvoider>
      </BottomSheetScrollView>
      <FloatingBottomContainer>
        <Button onPress={saveNotes} style={styles.button} text={loc.transactionDetails.saveNotes} size="large" color="kraken" />
      </FloatingBottomContainer>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 24,
  },
  container: {
    marginTop: 25,
  },
  input: {
    minHeight: 120,
  },
  subText: {
    marginTop: 12,
  },
  button: {
    marginHorizontal: 24,
  },
});

EditNoteScreen.navigationOptions = navigationStyle({
  title: loc.editNote.title,
  animation: 'none',
  presentation: 'transparentModal',
  gestureEnabled: false,
  headerShown: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
});
