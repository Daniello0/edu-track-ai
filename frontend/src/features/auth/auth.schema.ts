import * as yup from 'yup';
import {
  INVALID_EMAIL_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  MIN_PASSWORD_LENGTH,
} from './auth.constants';
import type { AuthFormValues } from './auth.types';

/**
 * Yup schema for email/password auth form validation.
 * Sign-in and sign-up share the same field rules per Firebase requirements.
 */
export const authFormSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email(INVALID_EMAIL_MESSAGE)
      .required(INVALID_EMAIL_MESSAGE),
    password: yup
      .string()
      .min(MIN_PASSWORD_LENGTH, INVALID_PASSWORD_MESSAGE)
      .required(INVALID_PASSWORD_MESSAGE),
  })
  .required() satisfies yup.ObjectSchema<AuthFormValues>;
