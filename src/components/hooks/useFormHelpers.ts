import { FormikConfig, FormikProps, useFormik } from "formik";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import set from "lodash/set";
import React from "react";

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
    revertChanges: (field?: string) => void;
}

export interface IUseFormHelpersFormikChangedFieldsHelpers<T = any> {
    addField: (field: string) => void;
    removeField: (field: string) => void;
    hasChanges: (field?: string) => boolean;
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
    const changedFields = new Map();

    React.useEffect(() => {
        if (props.errors) {
            formik.setErrors(props.errors);
        }
    }, [props.errors, formik]);

    React.useEffect(() => {
        const changesReverted: string[] = [];

        changedFields.forEach((v, key) => {
            const initialValue = get(formik.initialValues, key);
            const value = get(formik.values, key);

            if (initialValue === value) {
                changesReverted.push(key);
            }
        });

        if (changesReverted.length > 0) {
            changesReverted.forEach((key) => changedFields.delete(key));
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

    const setArrayFieldItems = React.useCallback(
        (field: string, touched: any[], errors: any[], value: any[]) => {
            formik.setFieldTouched(field, touched as any);
            formik.setFieldError(field, errors as any);
            formik.setFieldValue(field, value as any);
        },
        [formik]
    );

    const addToArrayField = React.useCallback(
        (
            field: string,
            initialValue: any,
            initialError?: any,
            initialTouched?: any,
            index: number = 0
        ) => {
            const { value, touched, errors } = getArrayFieldItems(field);

            value.splice(index, 0, initialValue);
            touched.splice(index, 0, initialTouched);
            errors.splice(index, 0, initialError);

            setArrayFieldItems(field, touched, errors, value);
        },
        [setArrayFieldItems, getArrayFieldItems]
    );

    const deleteInArrayField = React.useCallback(
        (field: string, index: number) => {
            const { value, touched, errors } = getArrayFieldItems(field);

            value.splice(index, 1);
            touched.splice(index, 1);
            errors.splice(index, 1);

            setArrayFieldItems(field, touched, errors, value);
        },
        [setArrayFieldItems, getArrayFieldItems]
    );

    const moveInArrayField = React.useCallback(
        (field: string, srcIndex: number, destIndex: number) => {
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
        (field: string) => {
            if (!changedFields.has(field)) {
                changedFields.set(field, true);
            }
        },
        [changedFields]
    );

    const hasChanges = React.useCallback(
        (field?: string) => {
            if (field) {
                return changedFields.has(field);
            }

            return changedFields.size > 0;
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

        if (changedFields.size > 0) {
            return data;
        }

        return null;
    }, [changedFields, formik.values]);

    const clearAll = React.useCallback(() => {
        changedFields.clear();
    }, [changedFields]);

    const removeField = React.useCallback(
        (field: string) => {
            changedFields.delete(field);
        },
        [changedFields]
    );

    const revertChanges = React.useCallback(
        (field?: string) => {
            if (field) {
                const fieldInitialValue = get(formik.initialValues, field);

                if (fieldInitialValue) {
                    formik.setFieldValue(field, fieldInitialValue);
                    removeField(field);
                }
            } else {
                formik.setValues(formik.initialValues, true);
            }
        },
        [removeField, formik]
    );

    const formikHelpers: IUseFormHelpersFormikHelpers = React.useMemo(
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
            addField: addChangedField,
        }),
        [diffChanges, hasChanges, clearAll, addChangedField, removeField]
    );

    return {
        formik,
        formikHelpers,
        formikChangedFieldsHelpers,
    };
};

export default useFormHelpers;
