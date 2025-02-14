import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button/Button';
import { CircleIcon } from '@/components/CircleIcon/CircleIcon';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer/FloatingBottomContainer';
import { Label } from '@/components/Label/Label';

import { KrakenConnectWalletAlert } from './KrakenConnectWalletAlert';

import loc from '/loc';

type props = {
  accountNumber: number;
  onTransferPress: () => void;
};

export const KrakenConnectConnected = ({ accountNumber, onTransferPress }: props) => {
  return (
    <>
      <View style={[styles.flex, styles.body]}>
        <View>
          <Image style={styles.image} source={require('@/assets/images/krakenConnect/Futures.webp')} />
          <Label style={styles.title} type="boldDisplay2">
            {loc.krakenConnect.connected.success}
          </Label>
          <Label style={styles.title} type="boldTitle2">
            {loc.krakenConnect.connected.featuresTitle}
          </Label>
          <View style={styles.feature}>
            <CircleIcon name="receive" backgroundColor="martinique" />
            <Label style={styles.flex} type="regularBody">
              {loc.krakenConnect.connected.feature0}
            </Label>
          </View>
          <View style={styles.feature}>
            <CircleIcon name="line-chart" backgroundColor="martinique" />
            <Label style={styles.flex} type="regularBody">
              {loc.krakenConnect.connected.feature1}
            </Label>
          </View>
        </View>
      </View>
      <FloatingBottomContainer style={styles.buttons}>
        <KrakenConnectWalletAlert message={loc.krakenConnect.connected.alert} accountNumber={accountNumber} />
        <Button size="large" color="kraken" text={loc.krakenConnect.connected.cta} onPress={onTransferPress} />
      </FloatingBottomContainer>
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  image: {
    alignSelf: 'center',
  },
  body: {
    position: 'relative',
    paddingHorizontal: 24,
  },
  buttons: {
    marginHorizontal: 16,
    gap: 16,
  },
  title: {
    marginBottom: 16,
  },
  fetchingTitle: {
    textAlign: 'center',
  },
  feature: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },
});
