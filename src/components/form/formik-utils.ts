import { FormikErrors, FormikHelpers, FormikProps } from "formik";
import IOperation, {
  getOperationLastError,
  getOperationLastStatus,
  isOperationPending,
  isOperationStarted,
  isStatusTypeCompleted,
  isStatusTypeError,
  isStatusTypePending,
  isStatusTypeStarted,
} from "../../redux/operations/operation";

export function getGlobalError(errors: object) {
  return (errors as any).error;
}

const defaultFields = [];
export function deleteFields(values: object, fields: string[] = defaultFields) {
  const updated = { ...values };
  fields.forEach((field) => delete updated[field]);
  return updated;
}

export function applyOperationToFormik(
  operation?: IOperation,
  formikRef?: React.RefObject<any>
) {
  if (formikRef && formikRef.current && operation) {
    const isLoading =
      isOperationStarted(operation) || isOperationPending(operation);
    const error = getOperationLastError(operation);
    const formikBag = formikRef.current.getFormikBag();
    formikBag.setSubmitting(isLoading);

    if (error) {
      formikBag.setErrors(error.flatten() as any);
    }
  }
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

export function setFormikFormIsSubmitting(
  formikActions: FormikHelpers<any>,
  isSubmitting?: boolean
) {
  formikActions.setSubmitting(!!isSubmitting);
}

export function setFormikFormErrors(
  formikActions: FormikHelpers<any>,
  errors?: any
) {
  formikActions.setErrors(errors);
}

export function setFormikFormStateFromProps(
  formikActions: FormikHelpers<any>,
  props: IFormikFormState
) {
  setFormikFormIsSubmitting(formikActions, props.isSubmitting);
  setFormikFormErrors(formikActions, props.errors);
}

export function getFormikFormStateFromOperation(
  operation?: IOperation,
  scopeID?: string | number
): IFormikFormState {
  if (operation) {
    const lastStatus = getOperationLastStatus(operation, scopeID);

    if (lastStatus) {
      const isLoading =
        isStatusTypeStarted(lastStatus) || isStatusTypePending(lastStatus);
      const errors = isStatusTypeError(lastStatus) && lastStatus.error;

      return {
        isSubmitting: isLoading,
        errors: errors ? errors.flatten() : {},
      };
    }
  }

  return { isSubmitting: false, errors: {} };
}

export function shouldCloseFormikForm(
  operation?: IOperation,
  scopeID?: string | number
) {
  if (operation) {
    const lastStatus = getOperationLastStatus(operation, scopeID);

    if (lastStatus) {
      return isStatusTypeCompleted(lastStatus);
    }
  }

  return false;
}
