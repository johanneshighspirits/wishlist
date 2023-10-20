import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from 'react';
import { FieldConfig } from './types';

type FormState = {
  fields: { config: FieldConfig; value: string; isValid: boolean }[];
  isProcessing: boolean;
};
type Action =
  | {
      type: 'setValue';
      name: string;
      value: string;
      config?: FieldConfig;
    }
  | { type: 'reset'; fields: FieldConfig[] }
  | { type: 'setIsProcessing'; isProcessing: boolean };
type Dispatch = (action: Action) => void;

const FormContext = createContext<
  { state: FormState; dispatch: Dispatch } | undefined
>(undefined);

const reducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case 'reset': {
      return getInitialState(action.fields);
    }
    case 'setValue': {
      const { name, value, config } = action;
      return {
        ...state,
        fields: state.fields.map((field) => {
          const newConfig = {
            ...field.config,
            ...config,
          };
          if (field.config.name === name) {
            return {
              ...field,
              value,
              isValid: (newConfig.validators || []).every(
                (validator) => validator(value) === null
              ),
              config: newConfig,
            };
          }
          return field;
        }),
      };
    }
    case 'setIsProcessing': {
      return {
        ...state,
        isProcessing: action.isProcessing,
      };
    }
    default: {
      return state;
    }
  }
};

const initialState: FormState = {
  fields: [],
  isProcessing: false,
};

const getInitialState = (fields: FieldConfig[]) => {
  return {
    ...initialState,
    fields: fields.map((fieldConfig) => {
      return {
        config: fieldConfig,
        value: fieldConfig.initialValue || '',
        isValid: (fieldConfig.validators || []).every(
          (validator) => validator(fieldConfig.initialValue || '') === null
        ),
      };
    }),
  };
};

export const Form = ({
  fields,
  action,
  children,
}: PropsWithChildren<{
  fields: FieldConfig[];
  action?: (data: FormData) => Promise<any>;
}>) => {
  const [state, dispatch] = useReducer(reducer, getInitialState(fields));
  const value = { state, dispatch };

  return (
    <FormContext.Provider value={value}>
      <form
        className="flex flex-col gap-4 w-full max-w-xl mx-auto my-4"
        action={
          action
            ? async (...props) => {
                dispatch({ type: 'setIsProcessing', isProcessing: true });
                await action(...props);
                dispatch({ type: 'reset', fields });
                dispatch({ type: 'setIsProcessing', isProcessing: false });
              }
            : undefined
        }>
        {children}
      </form>
    </FormContext.Provider>
  );
};

export function useForm() {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error('useForm must be used in a FormContext');
  }
  const { state, dispatch } = ctx;
  const { fields, isProcessing } = state;

  const getValue = (name: string) =>
    fields.find((field) => field.config.name === name)?.value ?? '';
  const getValueAndConfig = (name: string) =>
    fields.find((field) => field.config.name === name) ?? {
      config: { name },
      value: '',
    };
  const setValue = (name: string, value: string, config?: FieldConfig) => {
    dispatch({ type: 'setValue', name, value, config });
    if (config?.onValueChange) {
      config.onValueChange(value, fields);
    }
  };

  const isValid = fields.every(({ isValid }) => isValid);

  return {
    fields,
    getValue,
    getValueAndConfig,
    setValue,
    isValid,
    isProcessing,
  };
}