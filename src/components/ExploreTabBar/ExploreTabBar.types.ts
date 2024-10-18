import { IconName } from '../SvgIcon';

export type ExploreTabBarProps = {
  onTabLeftPress: () => void;
  leftIconName: IconName;
  onTabCenterPress: () => void;
  centerIconName: IconName;
  onTabRightPress: () => void;
  rightIconName: IconName;
  activeTab?: number;
  showTabs?: boolean;
};

export type TabData = {
  name: IconName;
  onPress: () => void;
};
