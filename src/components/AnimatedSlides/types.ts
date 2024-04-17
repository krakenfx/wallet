export type AnimationMarkers = Record<
  `part-${number}`,
  {
    start: number;
    end: number;
  }
>;
