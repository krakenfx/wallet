import { Theme, useTheme } from '@/theme/themes';

export const useColorByCategory = (category: string, value: number) => {
  const { colors } = useTheme();
  const isDebt = category === 'borrow' || value < 0;
  const isReward = category === 'claimable';
  const color: keyof Theme['colors'] | undefined = isDebt ? 'yellow500' : isReward ? 'green400' : undefined;
  const backgroundColor = isDebt ? colors.yellow500_15 : isReward ? colors.green400_15 : undefined;

  return {
    color,
    backgroundColor,
    isDebt,
    isReward,
  };
};
