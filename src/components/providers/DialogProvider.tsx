"use client";

import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, ButtonVariant } from "../common/Button";
import { isDefined } from "@/utils/common";
import clsx from "clsx";

type DialogContent = {
  title?: string;
  body: React.JSX.Element;
  okAction?: {
    text: string;
    buttonVariant?: ButtonVariant;
    action?: () => void;
  };
  cancelAction?: {
    text: string;
    buttonVariant?: ButtonVariant;
    action?: () => void;
  };
};

type DialogContextState = {
  setContent: React.Dispatch<React.SetStateAction<DialogContent | null>>;
};

const DialogContext = createContext<DialogContextState | null>(null);

export const DialogProvider = ({ children }: PropsWithChildren) => {
  const [content, setContent] = useState<DialogContent | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (content) {
      dialogElement?.showModal();
    } else {
      dialogElement?.close();
    }
    return () => dialogElement?.close();
  }, [content]);

  return (
    <DialogContext.Provider value={{ setContent }}>
      {children}
      {content && (
        <dialog
          ref={dialogRef}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              content.cancelAction?.action?.();
              setContent(null);
            }
          }}
          className={clsx(
            "w-dvw max-h-dvh inset-2 md:w-fit md:min-w-80 md:max-w-[90vw]",
            "rounded-md border border-white bg-black text-white backdrop:backdrop-blur open:animate-fade-in open:backdrop:animate-fade-in",
          )}
        >
          <DialogContent content={content} />
        </dialog>
      )}
    </DialogContext.Provider>
  );
};

const DialogContent = ({ content }: { content: DialogContent | null }) => {
  const { closeDialog } = useDialog();
  if (!content) {
    return null;
  }

  const { title, body, okAction, cancelAction } = content;
  const actions = [cancelAction, okAction].filter(isDefined);
  return (
    <div className="flex flex-col justify-between gap-4">
      {title && (
        <div className="border-b border-white p-4 relative">
          <h1 className="text-center font-headline">{title}</h1>
          <button
            onClick={closeDialog}
            className="absolute top-0 right-0 px-4 h-full font-sans text-gray-500 hover:text-white"
          >
            x
          </button>
        </div>
      )}
      <div className="p-4 font-body">{body}</div>
      {actions.length > 0 && (
        <div className="flex gap-4 p-4 w-full">
          {actions.map(({ text, buttonVariant, action }) => (
            <Button
              className="flex-1 w-full"
              variant={buttonVariant || "primary"}
              onClick={() => {
                action?.();
                closeDialog();
              }}
              key={text}
            >
              {text}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("No DialogContext found");
  }

  const openDialog = (content: DialogContent) => {
    ctx.setContent(content);
  };

  const closeDialog = () => ctx.setContent(null);

  return { openDialog, closeDialog };
};
