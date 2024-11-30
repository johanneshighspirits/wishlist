"use client";
import { PropsWithChildren } from "react";
import { Button } from "./common/Button";
import { useDialog } from "./providers/DialogProvider";

export const ShareLink = ({
  title,
  pathName,
  children,
}: PropsWithChildren<{ title: string; pathName: string }>) => {
  const { openDialog } = useDialog();
  const handleClick = async () => {
    const url = `${location.origin}${pathName}`;
    console.log(url);
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        openDialog({
          title: `${title} är delad`,
          body: (
            <>
              <p>Länk till Önskelistan är kopierad till urklipp.</p>
              <a href={url}>{url}</a>
            </>
          ),
        });
      }
    } catch {
      openDialog({
        title: `Dela ${title}`,
        body: (
          <>
            <p>Länk att dela:</p>
            <a href={url}>{url}</a>
          </>
        ),
      });
    }
  };
  return (
    <Button variant="secondary" onClick={handleClick}>
      {children ? (
        children
      ) : (
        <>
          Dela
          <span className="inline-block -translate-y-[1px] translate-x-1">
            ↗
          </span>
        </>
      )}
    </Button>
  );
};
