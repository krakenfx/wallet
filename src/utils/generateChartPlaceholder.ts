export const generateChartPlaceholder = (
  numberOfPoints = 100,
): {
  timestamp: number;
  value: number;
}[] => {
  const placeholder = [];
  for (let i = 0; i < numberOfPoints; i++) {
    const timestamp = i + 1;
    const value = 1.5 * Math.sin((2.5 * Math.PI * i) / (numberOfPoints - 1));
    placeholder.push({ timestamp, value });
  }
  return placeholder;
};
