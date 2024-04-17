import React, { useRef } from 'react';
import { ScrollViewProps } from 'react-native/types';
import { ScrollView } from 'react-native-gesture-handler';

type Props = ScrollViewProps & {
  onRefresh: () => void;
  refreshThreshold?: number;
};

export const RefreshControlScrollViewIOS: React.FC<Props> = ({ children, refreshThreshold = 30, onRefresh, ...props }) => {
  const hasTriggered = useRef<boolean>(false);

  const onScroll: ScrollViewProps['onScroll'] = ({ nativeEvent }) => {
    if (nativeEvent.contentOffset.y < -refreshThreshold && !hasTriggered.current) {
      hasTriggered.current = true;
      onRefresh();
    }
  };

  const onBeginDrag = () => {
    hasTriggered.current = false;
  };

  return (
    <ScrollView scrollEventThrottle={16} onScrollBeginDrag={onBeginDrag} onScroll={onScroll} {...props}>
      {children}
    </ScrollView>
  );
};
