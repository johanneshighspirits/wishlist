import { PropsWithChildren } from "react";
import { Button } from "../common/Button";
import { useForm } from "./Form";
// @ts-expect-error
import { useFormStatus } from "react-dom";

export const SubmitButton = ({
  children,
  isDisabled,
}: PropsWithChildren<{ isDisabled?: boolean }>) => {
  const { isValid, isProcessing } = useForm();
  const { pending } = useFormStatus();
  const disabled = isDisabled || pending || !isValid || isProcessing;
  return (
    <Button className="mt-2 px-12 relative" disabled={disabled} type="submit">
      {(pending || isProcessing) && (
        <span className="absolute aspect-square border-t-white border-transparent border-t-2 rounded-full top-2 bottom-2 left-3 animate-spin"></span>
      )}
      {children}
    </Button>
  );
};
