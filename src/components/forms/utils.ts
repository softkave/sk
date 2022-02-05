import { FormikTouched } from "formik";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import { AnySchema, ValidationError } from "yup";

export const validateWithYupSchema = (
  yupSchema: AnySchema<any>,
  values: any
) => {
  try {
    yupSchema.validateSync(values, { abortEarly: false });

    return null;
  } catch (validationError: any) {
    const err: any = {};

    if (
      Array.isArray(validationError.inner) &&
      validationError.inner.length > 0
    ) {
      validationError.inner.forEach((item: ValidationError) => {
        if (item.path && !err[item.path]) {
          err[item.path] = item.message;
        }
      });
    } else {
      err[validationError.path] = validationError.message;
    }

    return err;
  }
};

export const getFormikTouched = <T>(val: T): FormikTouched<T> => {
  return Object.keys(val).reduce((accumulator, field) => {
    if (isObject(val[field]) || isArray(val[field])) {
      accumulator[field] = getFormikTouched(val[field]);
    } else {
      accumulator[field] = true;
    }

    return accumulator;
  }, {} as FormikTouched<T>);
};
