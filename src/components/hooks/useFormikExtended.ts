import { FormikConfig, FormikProps, useFormik } from "formik";
import get from "lodash/get";
import React from "react";

export interface IUseFormikExtendedHookProps<T> {
  formikProps: FormikConfig<T>;
  errors?: any;
}

export interface IUseFormikExtendedHookResult<T> {
  formik: FormikProps<T>;
  addNewValueToArrayField: (
    field: string,
    value: any,
    initialTouched: any,
    initialError: any
  ) => void;
  deleteIndexInArrayField: (field: string, index: number) => void;
  moveIndexInArrayField: (
    field: string,
    srcIndex: number,
    destIndex: number
  ) => void;
}

const useFormikExtended = <T>(
  props: IUseFormikExtendedHookProps<T>
): IUseFormikExtendedHookResult<T> => {
  const formik = useFormik(props.formikProps);

  React.useEffect(() => {
    if (props.errors) {
      formik.setErrors(props.errors);
    } else {
      formik.setErrors({});
    }
  }, [props, formik]);

  function getFieldFormikItems(field: string) {
    const currentList = get(formik.values, field);
    const currentTouched = get(formik.touched, field);
    const currentErrors = get(formik.errors, field);
    const listTouched = Array.from((currentTouched as any) || []);
    const listErrors = Array.from((currentErrors as any[]) || []);
    const list = [...currentList];
    return { list, listTouched, listErrors };
  }

  function setFieldFormikItems(
    field: string,
    listTouched: unknown[],
    listErrors: any[],
    list: any[]
  ) {
    formik.setFieldTouched(field, listTouched as any);
    // formik.setFieldError(field, listErrors as any);
    formik.setFieldValue(field, list);
  }

  const addNewValueToArrayField = (
    field: string,
    value: any,
    error: any,
    touched: any
  ) => {
    const { list, listTouched, listErrors } = getFieldFormikItems(field);

    list.unshift(value);
    listTouched.unshift(touched);
    listErrors.unshift(error);

    setFieldFormikItems(field, listTouched, listErrors, list);
  };

  const deleteIndexInArrayField = (field: string, index: number) => {
    const { list, listTouched, listErrors } = getFieldFormikItems(field);

    list.splice(index, 1);
    listTouched.splice(index, 1);
    listErrors.splice(index, 1);

    setFieldFormikItems(field, listTouched, listErrors, list);
  };

  const moveIndexInArrayField = (
    field: string,
    srcIndex: number,
    destIndex: number
  ) => {
    const { list, listTouched, listErrors } = getFieldFormikItems(field);

    const status = list[srcIndex];
    const statusTouched = listTouched[srcIndex];
    const statusErrors = listErrors[srcIndex];

    list.splice(srcIndex, 1);
    list.splice(destIndex, 0, status);
    listTouched.splice(srcIndex, 1);
    listTouched.splice(destIndex, 0, statusTouched);
    listErrors.splice(srcIndex, 1);
    listErrors.splice(destIndex, 0, statusErrors);

    setFieldFormikItems(field, listTouched, listErrors, list);
  };

  return {
    formik,
    addNewValueToArrayField,
    deleteIndexInArrayField,
    moveIndexInArrayField,
  };
};

export default useFormikExtended;
