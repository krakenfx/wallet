import { Image, StyleSheet, View } from 'react-native';

import { CloseButton } from '@/components/CloseButton';
import { Label } from '@/components/Label/Label';

import loc from '/loc';

export const KrakenConnectFetchingError = () => {
  return (
    <View style={[styles.flex, styles.body]}>
      <CloseButton style={styles.close} />
      <View style={styles.content}>
        <Image style={styles.image} source={require('@/assets/images/common/exclamation.png')} />
        <Label style={[styles.title]} type="boldDisplay3">
          {loc.krakenConnect.connectingFailed}
        </Label>
        <Label style={styles.title} type="regularBody">
          {loc.errors.genericTryAgainLater}
        </Label>
      </View>
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
  close: {
    alignSelf: 'flex-end',
  },
  content: {
    marginVertical: 'auto',
    paddingBottom: 96,
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
    textAlign: 'center',
    marginBottom: 16,
  },
});
