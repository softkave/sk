import { FormikTouched } from "formik";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import { Schema, ValidationError } from "yup";

export const validateWithYupSchema = (yupSchema: Schema<any>, values: any) => {
    try {
        yupSchema.validateSync(values, { abortEarly: false });

        return null;
    } catch (validationError) {
        const err: any = {};

        if (
            Array.isArray(validationError.inner) &&
            validationError.inner.length > 0
        ) {
            validationError.inner.forEach((err: ValidationError) => {
                if (!err[err.path]) {
                    err[err.path] = err.message;
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
