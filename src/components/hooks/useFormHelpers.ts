import { FormikConfig, FormikProps, useFormik } from "formik";
import { debounce } from "lodash";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import isNumber from "lodash/isNumber";
import set from "lodash/set";
import React from "react";
import useObject, { IUseObjectHookResult } from "./useObject";

export interface IUseFormHelpersFormikProps<T> {
  formikProps: FormikConfig<T>;
  errors?: any;
}

export interface IUseFormHelpersFormikHelpers<T extends object> {
  addToArrayField: (
    field: keyof T | string,
    value: any,
    initialTouched?: any,
    initialError?: any,
    index?: number
  ) => void;
  deleteInArrayField: (field: keyof T | string, index: number) => void;
  moveInArrayField: (
    field: string,
    srcIndex: number,
    destIndex: number
  ) => void;
  revertChanges: (field?: keyof T | string) => void;
}

export interface IUseFormHelpersFormikChangedFieldsHelpers<
  T extends object = any
> {
  addField: (field: keyof T) => void;
  pushFields: (fields: Array<keyof T>) => void;
  removeField: (field: keyof T) => void;
  hasChanges: (field?: keyof T) => boolean;
  diffChanges: () => Partial<T> | null;
  clearAll: () => void;
}

export interface IUseFormHelpersResult<T extends object> {
  formik: FormikProps<T>;
  formikHelpers: IUseFormHelpersFormikHelpers<T>;
  formikChangedFieldsHelpers: IUseFormHelpersFormikChangedFieldsHelpers<T>;
}

type GetChangedFieldsObjectType<T extends object> = {
  [key in keyof T]: boolean;
};

const reworkReverted = debounce(
  (
    changedFields: IUseObjectHookResult<any>,
    initialValues: any,
    values: any
  ) => {
    const changesReverted: any[] = [];
    changedFields.forEach((v, key) => {
      const initialValue = get(initialValues, key);
      const value = get(values, key);

      /**
       * TODO: using isEqual could potentially be slow for fields like
       * assignee in task, and other array and object fields.
       * Maybe find an alternative solution.
       */
      if ((!initialValue && !value) || isEqual(initialValue, value)) {
        changesReverted.push(key);
      }
    });

    if (changesReverted.length > 0) {
      changesReverted.forEach((key) => changedFields.remove(key));
    }
  },
  1000 /* one second */
);

const useFormHelpers = <T extends object>(
  props: IUseFormHelpersFormikProps<T>
): IUseFormHelpersResult<T> => {
  const formik = useFormik(props.formikProps);
  const changedFields = useObject<GetChangedFieldsObjectType<T>>();
  const setErrors = formik.setErrors;
  const initialValues = formik.initialValues;
  const values = formik.values;

  React.useEffect(() => {
    if (props.errors) {
      setErrors(props.errors);
    }
  }, [props.errors, setErrors]);

  React.useEffect(() => {
    reworkReverted(changedFields, initialValues, values);
  }, [changedFields, initialValues, values]);

  const getArrayFieldItems = React.useCallback(
    (field: keyof T | string) => {
      const currentValue = get(formik.values, field);
      const currentTouched = get(formik.touched, field);
      const currentErrors = get(formik.errors, field);

      const touched = Array.from(defaultTo(currentTouched, []));
      const errors = Array.from(defaultTo(currentErrors, []));
      const value = Array.from(defaultTo(currentValue, []));

      return { value, touched, errors };
    },
    [formik.values, formik.touched, formik.errors]
  );

  const setArrayFieldItems = React.useCallback(
    (field: keyof T | string, touched: any[], errors: any[], value: any[]) => {
      formik.setFieldTouched(field as string, touched as any);
      formik.setFieldError(field as string, errors as any);
      formik.setFieldValue(field as string, value as any);
    },
    [formik]
  );

  const addToArrayField = React.useCallback(
    (
      field: keyof T | string,
      initialValue: any,
      initialError?: any,
      initialTouched?: any,
      index?: number
    ) => {
      const { value, touched, errors } = getArrayFieldItems(field);

      if (isNumber(index)) {
        value.splice(index, 0, initialValue);
        touched.splice(index, 0, initialTouched);
        errors.splice(index, 0, initialError);
      } else {
        value.push(initialValue);
        touched.push(initialTouched);
        errors.push(initialError);
      }

      setArrayFieldItems(field, touched, errors, value);
    },
    [setArrayFieldItems, getArrayFieldItems]
  );

  const deleteInArrayField = React.useCallback(
    (field: keyof T | string, index: number) => {
      const { value, touched, errors } = getArrayFieldItems(field);

      value.splice(index, 1);
      touched.splice(index, 1);
      errors.splice(index, 1);

      setArrayFieldItems(field, touched, errors, value);
    },
    [setArrayFieldItems, getArrayFieldItems]
  );

  const moveInArrayField = React.useCallback(
    (field: keyof T | string, srcIndex: number, destIndex: number) => {
      const { value, touched, errors } = getArrayFieldItems(field);

      const status = value[srcIndex];
      const statusTouched = touched[srcIndex];
      const statusErrors = errors[srcIndex];

      value.splice(srcIndex, 1);
      value.splice(destIndex, 0, status);
      touched.splice(srcIndex, 1);
      touched.splice(destIndex, 0, statusTouched);
      errors.splice(srcIndex, 1);
      errors.splice(destIndex, 0, statusErrors);

      setArrayFieldItems(field, touched, errors, value);
    },
    [setArrayFieldItems, getArrayFieldItems]
  );

  const addChangedField = React.useCallback(
    (field: keyof T) => {
      if (!changedFields.has(field)) {
        changedFields.set(field, true);
      }
    },
    [changedFields]
  );

  const pushFields = React.useCallback(
    (fields: Array<keyof T>) => {
      const objFields = fields.reduce((accumulator, field) => {
        accumulator[field] = true;
        return accumulator;
      }, {} as GetChangedFieldsObjectType<T>);
      changedFields.merge(objFields);
    },
    [changedFields]
  );

  const hasChanges = React.useCallback(
    (field?: keyof T) => {
      if (field) {
        return changedFields.has(field);
      }

      return changedFields.size() > 0;
    },
    [changedFields]
  );

  const diffChanges = React.useCallback(() => {
    const data: any = {};
    changedFields.forEach((v, field) => {
      const value = get(formik.values, field);

      if (!value) {
        return;
      }

      set(data, field, value);
    });

    if (changedFields.size() > 0) {
      return data;
    }

    return null;
  }, [changedFields, formik.values]);

  const clearAll = React.useCallback(() => {
    changedFields.clear();
  }, [changedFields]);

  const removeField = React.useCallback(
    (field: keyof T) => {
      changedFields.remove(field);
    },
    [changedFields]
  );

  const revertChanges = React.useCallback(
    (field?: keyof T | string) => {
      if (field) {
        const fieldInitialValue = get(formik.initialValues, field);
        formik.setFieldValue(field as string, fieldInitialValue);
        removeField(field as any);
      } else {
        formik.setValues(formik.initialValues, true);
      }
    },
    [removeField, formik]
  );

  const formikHelpers: IUseFormHelpersFormikHelpers<T> = React.useMemo(
    () => ({
      addToArrayField,
      deleteInArrayField,
      moveInArrayField,
      revertChanges,
    }),
    [addToArrayField, deleteInArrayField, moveInArrayField, revertChanges]
  );

  const formikChangedFieldsHelpers = React.useMemo(
    () => ({
      diffChanges,
      hasChanges,
      clearAll,
      removeField,
      pushFields,
      addField: addChangedField,
    }),
    [
      diffChanges,
      hasChanges,
      clearAll,
      addChangedField,
      removeField,
      pushFields,
    ]
  );

  return {
    formik,
    formikHelpers,
    formikChangedFieldsHelpers,
  };
};

export default useFormHelpers;
