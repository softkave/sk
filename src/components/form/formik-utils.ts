import { FormikErrors, FormikProps } from "formik";

export function getGlobalError(errors: object = {}) {
  return (errors as any).error;
}

export type ToFormikFormErrors<ErrorsOrValues> = {
  [K in keyof ErrorsOrValues]?: string | string[];
};

export type IFormikFormErrors<Values> = ToFormikFormErrors<
  FormikErrors<Values>
> & {
  error?: string | string[];
};

export type IFormikFormBaseProps<Values> = FormikProps<Values> & {
  errors: IFormikFormErrors<Values>;
};

export interface IFormikFormState {
  isSubmitting?: boolean;
  errors?: IFormikFormErrors<any>;
}
