export function interpolateDataset(dataset: number[], targetLength: number): number[] {
  const originalLength = dataset.length;
  if (originalLength === targetLength) {
    return dataset;
  }

  const interpolated: number[] = [];
  const step = (originalLength - 1) / (targetLength - 1);

  for (let i = 0; i < targetLength; i++) {
    const position = i * step;
    const leftIndex = Math.floor(position);
    const rightIndex = Math.ceil(position);

    if (leftIndex === rightIndex) {
      interpolated.push(dataset[leftIndex]);
    } else {
      const weight = position - leftIndex;
      const leftValue = dataset[leftIndex];
      const rightValue = dataset[rightIndex];
      interpolated.push(leftValue + weight * (rightValue - leftValue));
    }
  }

  return interpolated;
}

type DataPoint = Record<string, number>;

export function interpolateMultiDimensionalDataset<T extends DataPoint>(dataset: T[], targetLength: number): T[] {
  if (!dataset.length) {
    return [];
  }

  const numericKeys = Object.keys(dataset[0]).filter(key => typeof dataset[0][key] === 'number') as Array<keyof T>;

  const result: T[] = Array.from({ length: targetLength }, () => ({ ...dataset[0] }));

  numericKeys.forEach(key => {
    const values = dataset.map(point => point[key] as number);
    const interpolatedValues = interpolateDataset(values, targetLength);

    interpolatedValues.forEach((value, index) => {
      (result[index][key] as number) = key === 'timestamp' ? Math.trunc(value) : value;
    });
  });

  return result;
}
