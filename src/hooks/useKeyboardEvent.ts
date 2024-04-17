import { useEffect } from 'react';
import { Keyboard, KeyboardEventListener, KeyboardEventName } from 'react-native';

export const useKeyboardEvent = (eventType: KeyboardEventName, listener: KeyboardEventListener) => {
  useEffect(() => {
    const subscription = Keyboard.addListener(eventType, listener);
    return () => {
      subscription.remove();
    };
  }, [eventType, listener]);
};
