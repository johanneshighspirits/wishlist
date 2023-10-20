import { ChangeEventHandler, FocusEventHandler, useState } from 'react';
import { useForm } from './Form';
import { FieldConfig } from './types';
import clsx from 'clsx';

export const Input = ({ name, type = 'text' }: FieldConfig) => {
  const { getValueAndConfig, setValue, setIsDirty } = useForm();
  const { value, error, config, isDirty } = getValueAndConfig(name);
  const { labelText, placeholderText, infoText } = config;

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    setIsDirty(name, true);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(name, e.target.value, config);
  };

  const isRequired = config.validators?.some((v) => v.name === 'required');
  const hasError = isDirty && error !== null;

  return (
    <label className={clsx('flex flex-col flex-1 gap-4 pb-2')}>
      {labelText}
      {isRequired ? ' *' : ''}
      <input
        name={name}
        className={clsx(
          'text-black bg-slate-200 focus:bg-white py-2 px-4 rounded-sm w-full placeholder:text-gray-700 focus:placeholder:text-gray-400',
          hasError && 'border border-red-500 bg-red-200'
        )}
        type={type}
        value={value}
        required={isRequired}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder={placeholderText}></input>
      {hasError && (
        <div className="text-red-200 py-2 px-4 rounded-sm bg-red-800/30">
          💥 {error.message} 💥
        </div>
      )}
      {infoText && <div>{infoText}</div>}
    </label>
  );
};
