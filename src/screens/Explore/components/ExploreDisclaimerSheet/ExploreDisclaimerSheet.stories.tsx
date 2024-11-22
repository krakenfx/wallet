import { useRef, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/Button';

import { ExploreDisclaimerSheet } from './ExploreDisclaimerSheet';

import type BottomSheetView from '@gorhom/bottom-sheet';

import type { Meta, StoryObj } from '@storybook/react';

const ExploreDisclaimerSheetMeta: Meta<typeof ExploreDisclaimerSheet> = {
  title: 'Explore/ExploreDisclaimerSheet',
  component: ExploreDisclaimerSheet,
  render: function Render() {
    const [reset, setReset] = useState<boolean>(false);
    const sheetRef = useRef<BottomSheetView>(null);

    if (reset) {
      return (
        <View style={{ padding: 24 }}>
          <Button text="Open Sheet" onPress={() => setReset(false)} size="large" color="kraken" />
        </View>
      );
    }

    return (
      <ExploreDisclaimerSheet
        ref={sheetRef}
        onContinue={() => sheetRef?.current?.close()}
        onDismiss={() => sheetRef?.current?.close()}
        onClose={() => {
          setReset(true);
        }}
        onMount={() => console.log('onMount')}
      />
    );
  },
  decorators: [
    Story => {
      return (
        <>
          <Story />
        </>
      );
    },
  ],
};

export default ExploreDisclaimerSheetMeta;

export const Basic: StoryObj<typeof ExploreDisclaimerSheet> = {};
