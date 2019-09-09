// import { notification } from "antd";
import { FormikActions } from "formik";

import { INetError } from "../net/query";
import { indexArray } from "../utils/object";

export function withGlobalError(values: object) {
  return {
    ...values,
    error: undefined
  };
}

export function getGlobalError(errors: object) {
  return (errors as any).error;
}

const defaultFields = ["error"];
export function deleteFields(values: object, fields: string[] = defaultFields) {
  const updated = { ...values };
  fields.forEach(field => delete updated[field]);
  return updated;
}

export function flattenErrorToObject(error: INetError[]) {
  return indexArray(error, {
    indexer: (next: INetError) => {
      if (next.field) {
        return next.field;
      } else {
        return "error";
      }
    },
    proccessValue: (value, existing) => {
      if (existing) {
        existing.push(value.message);
        return existing;
      } else {
        return [value.message];
      }
    }
  });
}

/**
 * TODO: Define a better process, and let the submitHandler do just one thing, handle submit
 * Remove the strip and error handling
 * Make the strip and error handling into a pipeline of sorts
 */
interface ISubmitHandlerOptions extends FormikActions<any> {
  fieldsToDelete?: string[];
  onError?: () => void;
  onSuccess?: () => void;
  onComplete?: () => void;
}

export async function submitHandler(
  onSubmit,
  values: object,
  {
    setSubmitting,
    setErrors,
    fieldsToDelete,
    onError,
    onComplete,
    onSuccess
  }: ISubmitHandlerOptions
) {
  let result = null;

  try {
    if (fieldsToDelete && fieldsToDelete.indexOf("error") === -1) {
      fieldsToDelete.push("error");
    }

    result = await onSubmit(deleteFields(values, fieldsToDelete));

    if (onSuccess) {
      setSubmitting(false);
      onSuccess();
    }
  } catch (error) {
    let flattenedError = flattenErrorToObject(error);

    if (process.env.NODE_ENV === "development") {
      const fieldsPlusErrors = error.map(e => {
        return {
          ...e,
          message: `${e.field} - ${e.message}`
        };
      });

      flattenedError = {
        ...flattenedError,
        error: flattenedError.error
          ? flattenedError.error.concat(fieldsPlusErrors)
          : fieldsPlusErrors
      };

      // notification.error({
      //   message: fieldsPlusErrors.map((e) => {
      //     return e.message;
      //   }).join("/n")
      // })

      // console.log("--------------- start");
      // console.log("---------------");
      // fieldsPlusErrors.forEach((e) => {
      //   console.log(e.message);
      // });
      // console.log("---------------");
      // console.log("--------------- end");
    }

    setSubmitting(false);
    setErrors(flattenedError);

    if (onError) {
      onError();
    }
  }

  if (onComplete) {
    onComplete();
  }

  return result;
}

export function touchFields(options: ISubmitHandlerOptions, fields: string[]) {
  fields.forEach(field => {
    options.setFieldTouched(field, true);
  });
}
