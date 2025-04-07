import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Image, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button/Button';
import { CircleIcon } from '@/components/CircleIcon/CircleIcon';
import { FadingElement } from '@/components/FadingElement';
import { FloatingBottomContainer } from '@/components/FloatingBottomContainer/FloatingBottomContainer';
import { Label } from '@/components/Label/Label';

import { useDeviceSize } from '@/hooks/useDeviceSize';

import { KrakenConnectWalletAlert } from './KrakenConnectWalletAlert';

import loc from '/loc';

type props = {
  accountNumber: number;
  onTransferPress: () => void;
};

export const KrakenConnectConnected = ({ accountNumber, onTransferPress }: props) => {
  const { size } = useDeviceSize();
  const isSmall = size === 'small';
  const displayType = isSmall ? 'boldDisplay3' : 'boldDisplay2';
  const bodyType = isSmall ? 'regularCaption1' : 'regularBody';

  return (
    <View style={styles.flex}>
      <View style={[styles.flex, styles.body]}>
        <View style={styles.flex}>
          <FadingElement y1="100%" y2="80%">
            <BottomSheetScrollView style={styles.flex}>
              <Image style={styles.image} source={require('@/assets/images/krakenConnect/Futures.webp')} />
              <Label style={styles.title} type={displayType}>
                {loc.krakenConnect.connected.success}
              </Label>
              <Label style={styles.title} type="boldTitle1">
                {loc.krakenConnect.connected.featuresTitle}
              </Label>
              <View style={styles.feature}>
                <CircleIcon name="receive" backgroundColor="martinique" />
                <Label style={styles.flex} type={bodyType}>
                  {loc.krakenConnect.connected.feature0}
                </Label>
              </View>
              <View style={styles.feature}>
                <CircleIcon name="line-chart" backgroundColor="martinique" />
                <Label style={styles.flex} type={bodyType}>
                  {loc.krakenConnect.connected.feature1}
                </Label>
              </View>
              <View style={[styles.cta, isSmall && styles.ctaSmall]}>
                <KrakenConnectWalletAlert message={loc.krakenConnect.connected.alert} accountNumber={accountNumber} />
              </View>
            </BottomSheetScrollView>
          </FadingElement>
        </View>
      </View>
      <FloatingBottomContainer style={styles.buttons}>
        <Button size="large" color="kraken" text={loc.krakenConnect.connected.cta} onPress={onTransferPress} />
      </FloatingBottomContainer>
    </View>
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
  cta: {
    marginTop: 16,
  },
  ctaSmall: {
    marginTop: 12,
    paddingBottom: 84,
  },
});
