import { FormikTouched } from "formik";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";

export const validateWithYupSchema = (yupSchema, values) => {
  try {
    yupSchema.validateSync(values, { abortEarly: false });

    return null;
  } catch (validationError) {
    const err: any = {};

    if (
      Array.isArray(validationError.inner) &&
      validationError.inner.length > 0
    ) {
      validationError.inner.forEach((er) => {
        if (!err[er.path]) {
          err[er.path] = er.message;
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
  }, {});
};
