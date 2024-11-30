"use client";

import { useDialog } from "./DialogProvider";

export const DialogTester = () => {
  const { openDialog } = useDialog();

  return (
    <button
      onClick={() =>
        openDialog({
          title: "I am a dialog",
          body: <div>main body</div>,
          okAction: {
            text: "OK",
            action: () => {
              console.log("OK pressed");
            },
          },
          cancelAction: {
            text: "Cancel",
            buttonVariant: "secondary",
            action: () => {
              console.log("Cancel pressed");
            },
          },
        })
      }
    >
      Öppna
    </button>
  );
};
