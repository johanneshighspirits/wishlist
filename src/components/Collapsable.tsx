"use client";

import { PropsWithChildren, useState } from "react";
import { Button } from "./common/Button";
import clsx from "clsx";

export const Collapsable = ({
  title,
  children,
}: PropsWithChildren<{ title: string }>) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <>
      <Button
        disabled={!isCollapsed}
        variant="secondary"
        className={clsx(
          "transition-opacity duration-500 delay-300",
          isCollapsed ? "opacity-100" : "opacity-0",
        )}
        onClick={() => setIsCollapsed(false)}
      >
        {title}
      </Button>
      <div
        className={clsx(
          "grid gap-4 transition-[grid-template-rows] duration-1000 overflow-hidden",
          isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
        )}
      >
        <div
          className={clsx(
            "flex flex-col gap-4 min-h-0 transition-all duration-1000",
            isCollapsed ? "blur-lg" : "blur-0",
          )}
        >
          {children}
          <Button
            variant="tertiary"
            className="ml-auto mr-0"
            onClick={() => setIsCollapsed(true)}
          >
            Stäng
          </Button>
        </div>
      </div>
    </>
  );
};
