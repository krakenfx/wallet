export const formatPercentage = (percentage: number) => {
  const percentageDecimals = percentage < 10 ? (percentage % 1 === 0 ? 0 : 2) : 0;
  const percentageFormatted = percentage.toFixed(percentageDecimals) + '%';

  return percentageFormatted;
};
