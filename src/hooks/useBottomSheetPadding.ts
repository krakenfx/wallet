import { useSafeAreaInsets } from 'react-native-safe-area-context';


export const useBottomSheetPadding = (hasNoButtons?: boolean, extraMargin = 0) => {
  const insets = useSafeAreaInsets();

  if (hasNoButtons) {
    return insets.bottom + extraMargin;
  }
  return insets.bottom + 90 + extraMargin;
};
