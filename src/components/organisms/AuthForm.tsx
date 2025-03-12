import { FormEvent } from 'react';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';

interface AuthFormProps {
  title: string;
  buttonText: string;
  isRegister?: boolean;
  loading?: boolean;
  errors: Record<string, string | undefined>;
  values: {
    email: string;
    password: string;
    age?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
}

export const AuthForm = ({
  title,
  buttonText,
  isRegister = false,
  loading = false,
  errors,
  values,
  onChange,
  onSubmit,
}: AuthFormProps) => {
  return (
    <div className="w-full max-w-md">
      <div>
        <h2 className="mb-4 text-center text-xl text-gray-900 dark:text-white">{title}</h2>
      </div>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <FormField
            name="email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            value={values.email}
            onChange={onChange}
            error={errors.email}
            touched={!!values.email}
            autoComplete="email"
            required
          />

          <FormField
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={values.password}
            onChange={onChange}
            error={errors.password}
            touched={!!values.password}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            required
          />

          {isRegister && (
            <FormField
              name="age"
              type="number"
              label="Age"
              placeholder="Enter your age"
              value={values.age || ''}
              onChange={onChange}
              error={errors.age}
              touched={!!values.age}
              required
              min={18}
              max={99}
            />
          )}
        </div>

        <Button type="submit" fullWidth loading={loading} disabled={loading}>
          {buttonText}
        </Button>
      </form>
    </div>
  );
};
