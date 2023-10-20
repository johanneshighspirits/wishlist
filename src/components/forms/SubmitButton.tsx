import { PropsWithChildren } from 'react';
import { Button } from '../common/Button';
import { useForm } from './Form';

export const SubmitButton = ({ children }: PropsWithChildren) => {
  const { isValid, isProcessing } = useForm();
  return (
    <Button disabled={!isValid || isProcessing} type="submit">
      {children}
    </Button>
  );
};
