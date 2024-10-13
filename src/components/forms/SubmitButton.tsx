import { PropsWithChildren } from 'react';
import { Button } from '../common/Button';
import { useForm } from './Form';
// @ts-expect-error
import { useFormStatus } from 'react-dom';

export const SubmitButton = ({
  children,
  isDisabled,
}: PropsWithChildren<{ isDisabled?: boolean }>) => {
  const { isValid, isProcessing } = useForm();
  const { pending } = useFormStatus();
  return (
    <Button
      className="mt-2"
      disabled={isDisabled || pending || !isValid || isProcessing}
      type="submit">
      {children}
    </Button>
  );
};
