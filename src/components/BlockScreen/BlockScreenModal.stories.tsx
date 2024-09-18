import { useRef } from 'react';

import { View } from 'react-native';

import { BottomSheetModalRef } from '../BottomSheet';

import { Button } from '../Button';

import { BlockScreenModal } from './BlockScreenModal';

import type { Meta, StoryObj } from '@storybook/react';

const BlockScreenModalMeta: Meta<typeof BlockScreenModal> = {
  title: 'BlockScreen/BlockScreenModal',
  component: BlockScreenModal,
  render: function Render(args) {
    const blockScreenRef = useRef<BottomSheetModalRef>(null);

    const onHide = () => blockScreenRef.current?.close();

    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 30 }}>
        <Button icon="eye" text="Show Modal" onPress={() => blockScreenRef.current?.present()} />
        <BlockScreenModal ref={blockScreenRef} {...args} onGoBack={onHide} onProceed={onHide} />
      </View>
    );
  },
};

export default BlockScreenModalMeta;

type Story = StoryObj<typeof BlockScreenModal>;

export const Basic: Story = {
  args: {
    title: 'Transaction Flagged!',
    message: 'This transaction has been flagged by our system.',
  },
};
