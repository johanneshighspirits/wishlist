import { PropsWithChildren } from 'react';
import { Button } from '../common/Button';
import { useForm } from './Form';

export const SubmitButton = ({
  children,
  isDisabled,
}: PropsWithChildren<{ isDisabled?: boolean }>) => {
  const { isValid, isProcessing } = useForm();
  return (
    <Button
      className="mt-2"
      disabled={isDisabled || !isValid || isProcessing}
      type="submit">
      {children}
    </Button>
  );
};
