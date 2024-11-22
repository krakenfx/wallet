import { AuthenticationType } from 'expo-local-authentication';
import { useEffect, useRef } from 'react';
import { Platform, View } from 'react-native';

import { MissingBiometricsSheet } from './MissingBiometricsSheet';

import type { BottomSheetModalRef } from '../BottomSheet';

import type { Meta, StoryObj } from '@storybook/react';

type MissingBiometricsSheetPropsAndCustomArgs = React.ComponentProps<typeof MissingBiometricsSheet> & {
  includeFaceId: boolean;
  includeFingerprint: boolean;
  includeIris: boolean;
};

const MissingBiometricsSheetMeta: Meta<MissingBiometricsSheetPropsAndCustomArgs> = {
  title: 'MissingBiometricsSheet',
  component: MissingBiometricsSheet,
  decorators: [
    Story => (
      <View style={{ padding: 30, justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  render: function Render({ includeFaceId, includeFingerprint, includeIris }) {
    const bottomSheetModalRef = useRef<BottomSheetModalRef>(null);

    useEffect(() => {
      bottomSheetModalRef.current?.present();
    }, [bottomSheetModalRef]);

    const authenticationTypes = [
      includeFaceId ? AuthenticationType.FACIAL_RECOGNITION : null,
      includeFingerprint ? AuthenticationType.FINGERPRINT : null,
      includeIris ? AuthenticationType.IRIS : null,
    ].filter(authType => authType !== null);

    return <MissingBiometricsSheet authenticationTypes={authenticationTypes} ref={bottomSheetModalRef} />;
  },
};

export default MissingBiometricsSheetMeta;

type Story = StoryObj<MissingBiometricsSheetPropsAndCustomArgs>;

export const Basic: Story = {
  args: {
    includeFingerprint: true,
    includeIris: true,
    ...(Platform.OS === 'ios' ? { includeFaceId: true } : {}),
  },
};
