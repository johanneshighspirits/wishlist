import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from 'react';
import { FieldConfig, ValidationError } from './types';
import { validateField } from './Validators';

type FormState<T extends string> = {
  fields: {
    config: FieldConfig<T>;
    value: string;
    isValid: boolean;
    isDirty: boolean;
    error: ValidationError | null;
  }[];
  isProcessing: boolean;
};
type Action<T extends string> =
  | {
      type: 'setValue';
      name: string;
      value: string;
      config?: FieldConfig<T>;
    }
  | { type: 'reset'; fields: FieldConfig<T>[] }
  | { type: 'setIsProcessing'; isProcessing: boolean }
  | { type: 'setIsDirty'; name: string; isDirty: boolean }
  | { type: 'addField'; config: FieldConfig<T> };

type Dispatch = <T extends string>(action: Action<T>) => void;

const FormContext = createContext<
  { state: FormState<any>; dispatch: Dispatch } | undefined
>(undefined);

const reducer = <T extends string>(
  state: FormState<T>,
  action: Action<T>
): FormState<T> => {
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
            const error = validateField(value, field.config.validators);
            return {
              ...field,
              value,
              isValid: error === null,
              error,
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
    case 'setIsDirty': {
      return {
        ...state,
        fields: state.fields.map((field) => {
          if (field.config.name === action.name) {
            return {
              ...field,
              isDirty: action.isDirty,
            };
          }
          return field;
        }),
      };
    }
    case 'addField': {
      return {
        ...state,
        fields: [
          ...state.fields,
          {
            value: action.config.initialValue || '',
            config: action.config,
            isDirty: false,
            isValid: true,
            error: null,
          },
        ],
      };
    }
    default: {
      return state;
    }
  }
};

const initialState: FormState<any> = {
  fields: [],
  isProcessing: false,
};

const getInitialState = <T extends string>(fields: FieldConfig<T>[]) => {
  return {
    ...initialState,
    fields: fields.map((fieldConfig) => {
      const error = validateField(
        fieldConfig.initialValue || '',
        fieldConfig.validators
      );
      return {
        config: fieldConfig,
        value: fieldConfig.initialValue || '',
        isValid: error === null,
        isDirty: false,
        error,
      };
    }),
  };
};

export const Form = ({
  fields,
  action,
  children,
}: PropsWithChildren<{
  fields: FieldConfig<any>[];
  action?: (data: FormData) => Promise<any>;
}>) => {
  const [state, dispatch] = useReducer(reducer, getInitialState(fields));
  const value = { state, dispatch };

  return (
    <FormContext.Provider value={value}>
      <form
        className="flex flex-col gap-2 lg:gap-4 w-full max-w-xl mx-auto my-4"
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
      config: { name } as FieldConfig<any>,
      value: '',
      isValid: true,
      isDirty: false,
      error: null,
    };

  const setValue = (name: string, value: string, config?: FieldConfig<any>) => {
    dispatch({ type: 'setValue', name, value, config });
    if (config?.onValueChange) {
      config.onValueChange(value, fields);
    }
  };

  const setIsDirty = (name: string, isDirty: boolean) => {
    dispatch({ type: 'setIsDirty', name, isDirty });
  };

  const addField = (config: FieldConfig<any>) => {
    dispatch({ type: 'addField', config });
  };

  const isValid = fields.every(({ isValid }) => isValid);

  return {
    fields,
    getValue,
    getValueAndConfig,
    setValue,
    setIsDirty,
    isValid,
    isProcessing,
    addField,
  };
}
