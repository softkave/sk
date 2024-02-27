import { FormikErrors } from "formik";

export function getFormError(errors: object = {}) {
  return (errors as any).error;
}

export type IFormikFormErrors<Values> = FormikErrors<Values> & {
  error?: string | string[];
};
