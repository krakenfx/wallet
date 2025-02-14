import { Image, StyleSheet, View } from 'react-native';

import { ActivityIndicator } from '@/components/ActivityIndicator';
import { Label } from '@/components/Label/Label';

import loc from '/loc';

export const KrakenConnectFetchingCredentials = () => {
  return (
    <View style={[styles.flex, styles.body]}>
      <ActivityIndicator style={styles.activityIndicator} />
      <View style={styles.content}>
        <Image style={styles.image} source={require('@/assets/images/krakenConnect/Futures.webp')} />
        <Label style={[styles.title, styles.fetchingTitle]} type="boldDisplay3">
          {loc.krakenConnect.connecting}
        </Label>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: { opacity: 0.25 },
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
  activityIndicator: {
    alignSelf: 'center',
    top: '25%',
  },
  title: {
    marginBottom: 16,
  },
  fetchingTitle: {
    textAlign: 'center',
  },
});
