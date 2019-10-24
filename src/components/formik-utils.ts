import { Formik } from "formik";

import IOperation, {
  getOperationLastError,
  isOperationPending,
  isOperationStarted
} from "../redux/operations/operation";

export function getGlobalError(errors: object) {
  return (errors as any).error;
}

const defaultFields = [];
export function deleteFields(values: object, fields: string[] = defaultFields) {
  const updated = { ...values };
  fields.forEach(field => delete updated[field]);
  return updated;
}

export function applyOperationToFormik(
  operation?: IOperation,
  formikRef?: React.RefObject<Formik<any>>
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
