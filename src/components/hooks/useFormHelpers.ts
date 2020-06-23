import { FormikConfig, FormikProps, useFormik } from "formik";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import set from "lodash/set";
import React from "react";
import useArray from "./useArray";

export interface IUseFormHelpersFormikProps<T> {
  formikProps: FormikConfig<T>;
  errors?: any;
}

export interface IUseFormHelpersFormikHelpers {
  addToArrayField: (
    field: string,
    value: any,
    initialTouched?: any,
    initialError?: any,
    index?: number
  ) => void;
  deleteInArrayField: (field: string, index: number) => void;
  moveInArrayField: (
    field: string,
    srcIndex: number,
    destIndex: number
  ) => void;
}

export interface IUseFormHelpersFormikChangedFieldsHelpers<T = any> {
  addField: (field: string) => void;
  hasChanges: () => boolean;
  diffChanges: () => Partial<T> | null;
  clearAll: () => void;
}

export interface IUseFormHelpersResult<T> {
  formik: FormikProps<T>;
  formikHelpers: IUseFormHelpersFormikHelpers;
  formikChangedFieldsHelpers: IUseFormHelpersFormikChangedFieldsHelpers<T>;
}

const useFormHelpers = <T>(
  props: IUseFormHelpersFormikProps<T>
): IUseFormHelpersResult<T> => {
  const formik = useFormik(props.formikProps);
  const changedFields = useArray<string>();

  React.useEffect(() => {
    if (props.errors) {
      formik.setErrors(props.errors);
    }
  }, [props.errors, formik]);

  React.useEffect(() => {
    const changesReverted = changedFields.getList().filter((field) => {
      const initialValue = get(formik.initialValues, field);
      const value = get(formik.values, field);

      return initialValue === value;
    });

    if (changesReverted.length > 0) {
      const fields = changedFields.getList();
      changesReverted.forEach((field) => {
        fields.splice(fields.indexOf(field), 1);
      });

      changedFields.setList(fields);
    }
  }, [changedFields, formik]);

  const getArrayFieldItems = React.useCallback(
    (field: string) => {
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

  const setArrayFieldItems = (
    field: string,
    touched: any[],
    errors: any[],
    value: any[]
  ) =>
    React.useCallback(() => {
      formik.setFieldTouched(field, touched as any);
      formik.setFieldError(field, errors as any);
      formik.setFieldValue(field, value as any);
    }, [formik.setFieldError, formik.setFieldTouched, formik.setFieldValue]);

  const addToArrayField = React.useCallback(
    (
      field: string,
      initialValue: any,
      initialError?: any,
      initialTouched?: any,
      index: number = 0
    ) => {
      const {
        value: value,
        touched: touched,
        errors: errors,
      } = getArrayFieldItems(field);

      value.splice(index, 0, initialValue);
      touched.splice(index, 0, initialTouched);
      errors.splice(index, 0, initialError);

      setArrayFieldItems(field, touched, errors, value);
    },
    [setArrayFieldItems, getArrayFieldItems]
  );

  const deleteInArrayField = React.useCallback(
    (field: string, index: number) => {
      const {
        value: value,
        touched: touched,
        errors: errors,
      } = getArrayFieldItems(field);

      value.splice(index, 1);
      touched.splice(index, 1);
      errors.splice(index, 1);

      setArrayFieldItems(field, touched, errors, value);
    },
    [setArrayFieldItems, getArrayFieldItems]
  );

  const moveInArrayField = React.useCallback(
    (field: string, srcIndex: number, destIndex: number) => {
      const {
        value: value,
        touched: touched,
        errors: errors,
      } = getArrayFieldItems(field);

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
    (field: string) => {
      if (!changedFields.exists(field)) {
        changedFields.add(field);
      }
    },
    [changedFields]
  );

  const hasChanges = React.useCallback(() => {
    return changedFields.getList().length > 0;
  }, [changedFields]);

  const diffChanges = React.useCallback(() => {
    const data: any = {};
    const fields = changedFields.getList();
    fields.forEach((field) => {
      const value = get(formik.values, field);

      if (!value) {
        return;
      }

      set(data, field, value);
    });

    if (fields.length > 0) {
      return data;
    }

    return null;
  }, [changedFields]);

  const clearAll = React.useCallback(() => {
    changedFields.reset();
  }, [changedFields]);

  const formikHelpers: IUseFormHelpersFormikHelpers = React.useMemo(
    () => ({
      addToArrayField,
      deleteInArrayField,
      moveInArrayField,
    }),
    [addToArrayField, deleteInArrayField, moveInArrayField]
  );

  const formikChangedFieldsHelpers = React.useMemo(
    () => ({
      diffChanges,
      hasChanges,
      clearAll,
      addField: addChangedField,
    }),
    [diffChanges, hasChanges, clearAll, addChangedField]
  );

  return {
    formik,
    formikHelpers,
    formikChangedFieldsHelpers,
  };
};

export default useFormHelpers;
