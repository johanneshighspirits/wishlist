export const isDefined = <T>(item: T | undefined | null): item is T =>
  item !== undefined && item !== null;
