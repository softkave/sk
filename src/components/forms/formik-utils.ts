import { FormikErrors, FormikProps } from "formik";

export function getFormError(errors: object = {}) {
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
