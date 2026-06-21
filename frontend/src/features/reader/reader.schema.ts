import * as yup from 'yup';
import type { ReaderDisplayFields } from './reader.types';

/**
 * Yup schema for reader display readiness (title and content must be present).
 */
export const readerDisplaySchema = yup
  .object({
    title: yup.string().trim().min(1).required(),
    content: yup.string().trim().min(1).required(),
  })
  .required() satisfies yup.ObjectSchema<ReaderDisplayFields>;
