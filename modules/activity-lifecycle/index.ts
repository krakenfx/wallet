import { DeviceEventEmitter, EmitterSubscription, NativeModules, Platform } from 'react-native';

type Event = 'onActivityStarted' | 'onActivityResumed' | 'onActivityPaused' | 'onActivityStopped';
interface ActivityLifecycleInterface {
  addListener(type: Event, listener: () => void): EmitterSubscription;
}

let Module: ActivityLifecycleInterface;

if (Platform.OS === 'android' && Platform.Version >= 29) {
  Module = {
    addListener: (event, listener) => DeviceEventEmitter.addListener(event, listener),
  };
  NativeModules.ActivityLifecycle.init();
} else {
  Module = {
    addListener: () => {
      throw Error('ActivityLifecycle not supported');
    },
  };
}

export default Module;
