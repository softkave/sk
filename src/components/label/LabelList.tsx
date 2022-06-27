import { Button, Divider } from "antd";
import { FormikErrors } from "formik";
import { noop } from "lodash";
import randomColor from "randomcolor";
import React from "react";
import * as yup from "yup";
import { IBlockLabelInput } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { getNewId } from "../../utils/utils";
import { getFormikTouched, validateWithYupSchema } from "../forms/utils";
import useArray from "../hooks/useArray";
import useFormHelpers from "../hooks/useFormHelpers";
import { labelValidationSchemas } from "../label/validation";
import ListHeader from "../utilities/ListHeader";
import Scrollbar from "../utilities/Scrollbar";
import LabelFormItem from "./LabelFormItem";

export interface ILabelListProps {
  labelList: IBlockLabelInput[];
  saveChanges: (labelList: IBlockLabelInput[]) => Promise<void>;

  errors?: FormikErrors<{ labelList: IBlockLabelInput[] }>;
  isSubmitting?: boolean;
}

const LabelList: React.FC<ILabelListProps> = (props) => {
  const { labelList, saveChanges, errors, isSubmitting } = props;
  const editingLabelList = useArray<string>();
  const newLabelList = useArray<string>();

  const onSubmit = (values: { labelList: IBlockLabelInput[] }) => {
    // TODO: should we alert the user before saving if they have editing labels?

    editingLabelList.reset();
    saveChanges(values.labelList);
  };

  // TODO: form still shows error that come from server when submitting
  // should it even be allowed to submit, considering there is an error?
  const { formik, formikHelpers } = useFormHelpers({
    errors,
    formikProps: {
      initialValues: { labelList },
      onSubmit,
      validationSchema: yup.object().shape({
        labelList: labelValidationSchemas.labelList,
      }),
      validateOnBlur: true,
      validateOnChange: true,
    },
  });

  React.useEffect(() => {
    const processErrors = () => {
      if (errors && errors.labelList) {
        const newEditingList: string[] = [];

        (errors.labelList as any).forEach((e, i) => {
          if (e) {
            const label = formik.values.labelList[i];

            if (!editingLabelList.exists(label.customId)) {
              newEditingList.push(label.customId);
            }
          }
        });

        if (newEditingList.length > 0) {
          editingLabelList.setList(newEditingList);
        }
      }
    };

    processErrors();
  }, [errors, formik.values.labelList, editingLabelList]);

  const onCommitChanges = (label: IBlockLabelInput, index: number) => {
    const err = validateWithYupSchema(
      labelValidationSchemas.label,
      formik.values.labelList[index]
    );

    if (err) {
      formik.setFieldTouched(
        `labelList.[${index}]`,
        getFormikTouched(err) as any,
        true
      );

      formik.setFieldError(`labelList.[${index}]`, err);
      return;
    }

    editingLabelList.remove(label.customId);
  };

  const onDiscardChanges = (index: number, initialValue?: IBlockLabelInput) => {
    if (initialValue) {
      formik.setFieldValue(`labelList.[${index}]`, initialValue);
      editingLabelList.remove(initialValue.customId);
    }
  };

  const onEdit = (id: string) => {
    editingLabelList.add(id);
  };

  const onChange = (index: number, data: Partial<IBlockLabelInput>) => {
    const changedFields = Object.keys(data);

    const nameField = `labelList.[${index}].name`;
    const descField = `labelList.[${index}].description`;
    const colorField = `labelList.[${index}].color`;

    if (changedFields.includes("name")) {
      formik.setFieldValue(nameField, data.name, true);
    }

    if (changedFields.includes("description")) {
      formik.setFieldValue(descField, data.description, true);
    }

    if (changedFields.includes("color")) {
      formik.setFieldValue(colorField, data.color, true);
    }
  };

  const handleBlur = (index: number, field: string) => {
    const fullField = `labelList.[${index}].${field}`;
    formik.handleBlur(fullField);
  };

  const getInitialValue = (id: string) => {
    return formik.initialValues.labelList.find(
      (status) => status.customId === id
    );
  };

  const onDelete = React.useCallback(
    (index: number) => {
      const label = formik.values.labelList[index];
      formikHelpers.deleteInArrayField("labelList", index);
      editingLabelList.remove(label.customId);
    },
    [editingLabelList, formik.values.labelList, formikHelpers]
  );

  const renderLabelItem = (label: IBlockLabelInput, index: number) => {
    const isEditing = editingLabelList.exists(label.customId);
    const touched = (formik.touched.labelList || [])[index];
    const labelErrors: any = (formik.errors.labelList || [])[index] || {};
    const initialValue = getInitialValue(label.customId);

    return (
      <React.Fragment key={label.customId}>
        <LabelFormItem
          onChange={(data) => {
            onChange(index, data);
          }}
          onCommitChanges={() => onCommitChanges(label, index)}
          onDelete={() => onDelete(index)}
          onDiscardChanges={() => onDiscardChanges(index, initialValue)}
          onEdit={() => onEdit(label.customId)}
          value={label}
          disabled={isSubmitting}
          errors={labelErrors}
          handleBlur={(field, evt) => handleBlur(index, field)}
          isEditing={isEditing}
          isNew={newLabelList.exists(label.customId)}
          touched={touched}
        />
        <Divider />
      </React.Fragment>
    );
  };

  const renderList = () => {
    const labels = formik.values.labelList.map((label, index) => {
      return renderLabelItem(label, index);
    });

    return (
      <div
        style={{
          flexDirection: "column",
          width: "100%",
          flex: 1,
          overflowY: "auto",
        }}
      >
        {labels}
      </div>
    );
  };

  const renderSubmitControls = () => {
    return (
      <div
        style={{
          flexDirection: "column",
          width: "100%",
          padding: "0px 16px 24px 16px",
        }}
      >
        <Button block loading={isSubmitting} type="primary" htmlType="submit">
          Save Changes
        </Button>
      </div>
    );
  };

  const onAddNewLabel = React.useCallback(() => {
    const label: IBlockLabelInput = {
      name: "",
      description: "",
      color: randomColor(),
      customId: getNewId(),
    };

    formikHelpers.addToArrayField("labelList", label, {}, {});
    editingLabelList.add(label.customId);
    newLabelList.add(label.customId);
  }, [editingLabelList, newLabelList, formikHelpers]);

  const renderAddControls = () => {
    return (
      <ListHeader
        hideSearchButton
        onCreate={onAddNewLabel}
        onSearchTextChange={noop}
        title="Labels"
        style={{ padding: "16px", paddingTop: "8px", paddingRight: "14px" }}
        disabled={
          isSubmitting ||
          formik.values.labelList.length >= blockConstants.maxAvailableLabels
        }
      />
    );
  };

  const renderMain = () => {
    return (
      <form
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateRows: "auto 1fr",
        }}
        onSubmit={formik.handleSubmit}
      >
        {renderAddControls()}
        <Scrollbar>
          {renderList()}
          {renderSubmitControls()}
        </Scrollbar>
      </form>
    );
  };

  return renderMain();
};

LabelList.defaultProps = {
  labelList: [],
};

export default React.memo(LabelList);
