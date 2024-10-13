import { ChangeEventHandler, FocusEventHandler } from 'react';
import { useForm } from './Form';
import { FieldConfig } from './types';
import clsx from 'clsx';
import { ImageUploader } from '../ImageUploader';

export function Input<FieldName extends string>({
  name,
  autoFocus,
}: FieldConfig<FieldName> & { autoFocus?: boolean }) {
  const { getValueAndConfig, setValue, setIsDirty } = useForm();
  const { value, error, config, isDirty } = getValueAndConfig(name);
  const { labelText, placeholderText, infoText, type = 'text' } = config;
  if (type === 'file') {
    return <ImageUploader name={name} />;
  }
  const isCheckbox = type === 'checkbox';

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    setIsDirty(name, true);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(
      name,
      isCheckbox ? (e.target.checked ? e.target.name : 'off') : e.target.value,
      config
    );
  };

  const isRequired = config.validators?.some((v) => v.name === 'required');
  const hasError = isDirty && error !== null;
  const label = `${labelText}${isRequired ? ' *' : ''}`;

  const inputProps = {
    name,
    type,
    value,
    required: isRequired,
    onBlur: handleBlur,
    onChange: handleChange,
    placeholder: placeholderText,
  };
  return (
    <label
      className={
        type === 'hidden'
          ? 'hidden'
          : clsx(
              'flex flex-1 gap-4',
              isCheckbox
                ? 'flex-row items-center cursor-pointer accent-sky-600 border border-white/25 has-[:checked]:border-white has-[:checked]:bg-white/10 rounded-md p-2'
                : 'flex-col pb-2'
            )
      }>
      {isCheckbox ? (
        <>
          <input className={clsx('h-6 w-6 rounded-sm')} {...inputProps}></input>
          <span>{label}</span>
        </>
      ) : (
        <>
          {label}
          <input
            autoFocus={autoFocus}
            className={clsx(
              'text-black bg-slate-200 focus:bg-white py-2 px-4 rounded-sm w-full placeholder:text-gray-700 focus:placeholder:text-gray-400',
              hasError && 'border border-red-500 bg-red-200'
            )}
            {...inputProps}></input>
        </>
      )}
      {hasError && (
        <div className="text-red-900 dark:text-red-200 py-2 px-4 rounded-sm bg-red-800/30">
          💥 {error.message} 💥
        </div>
      )}
      {infoText && <div>{infoText}</div>}
    </label>
  );
}
