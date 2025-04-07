import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button/Button';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer';
import { Label } from '@/components/Label/Label';

import { useDeviceSize } from '@/hooks/useDeviceSize';

import { KrakenConnectWalletAlert } from './KrakenConnectWalletAlert';

import loc from '/loc';

type Props = {
  accountNumber: number;
  noAccount: () => void;
  connect: () => void;
};

export const KrakenConnectLanding = ({ accountNumber, noAccount, connect }: Props) => {
  const { size } = useDeviceSize();
  const displayType = size === 'small' ? 'boldDisplay3' : 'boldDisplay2';
  return (
    <View style={styles.body}>
      <View>
        <Image style={styles.image} source={require('@/assets/images/krakenConnect/Futures.webp')} />
        <Label style={styles.labelContainer} type={displayType}>
          {loc.krakenConnect.unconnected.title}
        </Label>
        <Label style={styles.labelContainer} type="regularBody">
          {loc.krakenConnect.unconnected.body}
        </Label>
      </View>

      <FloatingBottomContainer style={styles.buttons}>
        <KrakenConnectWalletAlert message={loc.krakenConnect.unconnected.alert} accountNumber={accountNumber} />
        <Button size="large" icon="kraken" color="kraken" text={loc.krakenConnect.unconnected.cta} onPress={connect} />
        <Button size="large" text={loc.krakenConnect.unconnected.noAccount} onPress={noAccount} />
      </FloatingBottomContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
  },
  buttons: {
    marginHorizontal: 16,
    gap: 16,
  },
  labelContainer: {
    marginBottom: 16,
  },
});
