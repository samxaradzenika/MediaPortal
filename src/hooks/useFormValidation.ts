import { useState } from 'react';

type ValidationRule =
  | boolean
  | {
      required?: boolean;
      min?: number;
      max?: number;
    };

interface ValidationFields {
  email?: ValidationRule;
  password?: ValidationRule;
  age?: ValidationRule;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  age?: string;
  [key: string]: string | undefined;
}

interface FormValues {
  email?: string;
  password?: string;
  age?: string | number;
  [key: string]: string | number | undefined;
}

export const useFormValidation = (fields: ValidationFields) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (password.length > 12) {
      return 'Password must be at most 12 characters';
    }
    return undefined;
  };

  const validateAge = (age: string | number, rule?: ValidationRule): string | undefined => {
    const numAge = typeof age === 'string' ? parseInt(age, 10) : age;

    if (rule === true || (typeof rule === 'object' && rule.required)) {
      if (!age) {
        return 'Age is required';
      }
    }

    if (!numAge || isNaN(numAge)) {
      return 'Please enter a valid age';
    }

    if (typeof rule === 'object') {
      if (rule.min !== undefined && numAge < rule.min) {
        return `Age must be at least ${rule.min}`;
      }
      if (rule.max !== undefined && numAge > rule.max) {
        return `Age must be at most ${rule.max}`;
      }
    } else {
      if (numAge < 18) {
        return 'You must be at least 18 years old';
      }
      if (numAge > 99) {
        return 'Please enter a valid age';
      }
    }

    return undefined;
  };

  const validateField = (name: string, value: string | number) => {
    let error: string | undefined;

    switch (name) {
      case 'email':
        if (fields.email) {
          error = validateEmail(value as string);
        }
        break;
      case 'password':
        if (fields.password) {
          error = validatePassword(value as string);
        }
        break;
      case 'age':
        if (fields.age) {
          error = validateAge(value, fields.age);
        }
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return !error;
  };

  const validateForm = (values: FormValues): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (fields.email && values.email !== undefined) {
      const emailError = validateEmail(values.email);
      if (emailError) {
        newErrors.email = emailError;
        isValid = false;
      }
    }

    if (fields.password && values.password !== undefined) {
      const passwordError = validatePassword(values.password);
      if (passwordError) {
        newErrors.password = passwordError;
        isValid = false;
      }
    }

    if (fields.age && values.age !== undefined) {
      const ageError = validateAge(values.age, fields.age);
      if (ageError) {
        newErrors.age = ageError;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  return {
    errors,
    validateField,
    validateForm,
  };
};
