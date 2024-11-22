import type { TokenPriceHistoryItem } from '@/realm/tokenPrice';

const interpolate = (x0: number, y0: number, x1: number, y1: number, x: number): number => {
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
};

export const interpolateChartData = (data: TokenPriceHistoryItem[], targetLength: number): TokenPriceHistoryItem[] => {
  const originalLength = data.length;
  if (originalLength <= targetLength) {
    return data;
  }

  const resampledData: TokenPriceHistoryItem[] = [];
  const step = (originalLength - 1) / (targetLength - 1);

  for (let i = 0; i < targetLength; i++) {
    const index = i * step;
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);

    if (lowerIndex === upperIndex) {
      resampledData.push(data[lowerIndex]);
    } else {
      const lowerPoint = data[lowerIndex];
      const upperPoint = data[upperIndex];
      if (upperPoint) {
        const interpolatedValue = interpolate(
          lowerPoint.timestamp,
          lowerPoint.value,
          upperPoint.timestamp,
          upperPoint.value,
          lowerPoint.timestamp + (upperPoint.timestamp - lowerPoint.timestamp) * (index - lowerIndex),
        );
        resampledData.push({
          timestamp: Math.floor(lowerPoint.timestamp + (upperPoint.timestamp - lowerPoint.timestamp) * (index - lowerIndex)),
          value: interpolatedValue,
        });
      } else {
        resampledData.push({
          timestamp: Math.floor(lowerPoint.timestamp),
          value: lowerPoint.value,
        });
      }
    }
  }

  return resampledData;
};
