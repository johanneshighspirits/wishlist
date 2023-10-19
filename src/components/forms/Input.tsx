import { ChangeEventHandler } from 'react';
import { useForm } from './Form';
import { FieldConfig } from './types';

export const Input = ({ name, type = 'text' }: FieldConfig) => {
  const { getValueAndConfig, setValue } = useForm();
  const { value, config } = getValueAndConfig(name);
  const { labelText, placeholderText, infoText } = config;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(name, e.target.value, config);
  };

  return (
    <label className="flex flex-col flex-1 gap-4 pb-2">
      {labelText}
      <input
        name={name}
        className="text-black py-2 px-4 rounded-sm w-full"
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholderText}></input>
      {infoText && <div>{infoText}</div>}
      {/* <div className="text-red-200 py-2 px-4 rounded-sm bg-red-900/30">
        Error
      </div> */}
    </label>
  );
};
