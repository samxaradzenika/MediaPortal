import { InputHTMLAttributes } from 'react';
import { Input } from '../atoms/Input';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  touched?: boolean;
}

export const FormField = ({ label, error, touched, onBlur, ...props }: FormFieldProps) => {
  const showError = touched && !!error;

  return (
    <div className="mb-3">
      <label
        htmlFor={props.id || props.name}
        className="block text-sm text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <Input error={showError ? error : undefined} onBlur={onBlur} {...props} />
      {showError && (
        <p
          className="mt-1 text-xs text-red-600 dark:text-red-400"
          id={`${props.id || props.name}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
};
