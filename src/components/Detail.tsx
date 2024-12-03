import { PropsWithChildren, ReactNode } from "react";

export const Detail = ({
  summary,
  children,
}: PropsWithChildren<{ summary: ReactNode | string }>) => {
  return (
    <details className="w-full">
      <summary>{summary}</summary>
      {children}
    </details>
  );
};
