import { PropsWithChildren } from 'react';

export const SparkleText = ({
  children,
  hideSparkle = false,
}: PropsWithChildren<{ hideSparkle?: boolean }>) => {
  return <span>{hideSparkle ? children : <>✨ {children} ✨</>}</span>;
};
