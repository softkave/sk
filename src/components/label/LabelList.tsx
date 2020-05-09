import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FormikErrors } from "formik";
import randomColor from "randomcolor";
import React from "react";
import * as yup from "yup";
import { IBlockLabel } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { IUser } from "../../models/user/user";
import { newId } from "../../utils/utils";
import { validateWithYupSchema } from "../form/utils";
import useArray from "../hooks/useArray";
import useFormikExtended from "../hooks/useFormikExtended";
import { labelValidationSchemas } from "../label/validation";
import StyledContainer from "../styled/Container";
import LabelFormItem from "./LabelFormItem";

const StyledContainerAsForm = StyledContainer.withComponent("form");

export interface ILabelListProps {
  user: IUser;
  labelList: IBlockLabel[];
  saveChanges: (labelList: IBlockLabel[]) => Promise<void>;

  errors?: FormikErrors<IBlockLabel[]>;
  isSubmitting?: boolean;
}

const LabelList: React.FC<ILabelListProps> = (props) => {
  const { labelList, saveChanges, user, errors, isSubmitting } = props;
  const editingLabelList = useArray<string>();
  const newLabelList = useArray<string>();

  const onSubmit = (values: { labelList: IBlockLabel[] }) => {
    // TODO: should we alert the user before saving if they have editing labels?

    editingLabelList.reset();
    newLabelList.reset();
    saveChanges(values.labelList);
  };

  const {
    formik,
    deleteIndexInArrayField,
    addNewValueToArrayField,
  } = useFormikExtended({
    errors,
    formikProps: {
      initialValues: { labelList },
      onSubmit,
      validationSchema: yup.object().shape({
        labelList: labelValidationSchemas.labelList,
      }),
    },
  });

  const onCommitChanges = (label: IBlockLabel, index: number) => {
    const err = validateWithYupSchema(
      labelValidationSchemas.label,
      formik.values.labelList[index]
    );

    if (err) {
      formik.setFieldTouched(`labelList.[${index}].name`, true);
      formik.setFieldTouched(`labelList.[${index}].description`, true);
      return;
    }

    editingLabelList.remove(label.customId);
    newLabelList.remove(label.customId);
  };

  const onDiscardChanges = (label: IBlockLabel, index: number) => {
    formik.setFieldValue(`labelList.[${index}]`, label);
    editingLabelList.remove(label.customId);
    newLabelList.remove(label.customId);
  };

  const onEdit = (id: string) => {
    editingLabelList.add(id);
  };

  const onChange = (index: number, data: Partial<IBlockLabel>) => {
    const nameField = `labelList.[${index}].name`;
    const descField = `labelList.[${index}].description`;

    if (data.name) {
      formik.setFieldValue(nameField, data.name);
    } else if (data.description) {
      formik.setFieldValue(descField, data.description);
    }
  };

  const handleBlur = (index: number, field: string) => {
    const fullField = `labelList.[${index}].${field}`;
    formik.handleBlur(fullField);
  };

  const onDelete = React.useCallback(
    (index: number) => {
      const label = formik.values.labelList[index];

      deleteIndexInArrayField("labelList", index);
      editingLabelList.remove(label.customId);
      newLabelList.remove(label.customId);
    },
    [editingLabelList, formik.values.labelList, newLabelList]
  );

  const renderLabelItem = (label: IBlockLabel, index: number) => {
    const isEditing = editingLabelList.exists(label.customId);
    const touched = (formik.touched.labelList || [])[index];
    const labelErrors: any = (formik.errors.labelList || [])[index] || {};
    const values = formik.values.labelList[index];

    return (
      <LabelFormItem
        onChange={(data) => onChange(index, data)}
        onCommitChanges={() => onCommitChanges(label, index)}
        onDelete={() => onDelete(index)}
        onDiscardChanges={() => onDiscardChanges(label, index)}
        onEdit={() => onEdit(label.customId)}
        value={values}
        disabled={isSubmitting}
        errors={labelErrors}
        handleBlur={(field, evt) => handleBlur(index, field)}
        isEditing={isEditing}
        isNew={newLabelList.exists(label.customId)}
        touched={touched}
        style={{
          borderBottom:
            index < formik.values.labelList.length - 1
              ? "1px solid #f0f0f0"
              : undefined,
        }}
      />
    );
  };

  const renderList = () => {
    const labels = formik.values.labelList.map((label, index) => {
      return renderLabelItem(label, index);
    });

    return (
      <StyledContainer
        style={{
          flexDirection: "column",
          width: "100%",
          flex: 1,
          overflowY: "auto",
        }}
      >
        {labels}
      </StyledContainer>
    );
  };

  const renderSubmitControls = () => {
    return (
      <StyledContainer
        s={{
          flexDirection: "column",
          width: "100%",
          padding: "24px",
        }}
      >
        <Button loading={isSubmitting} type="primary" htmlType="submit">
          Save Changes
        </Button>
      </StyledContainer>
    );
  };

  const onAddNewLabel = React.useCallback(() => {
    const label: IBlockLabel = {
      name: "",
      description: "",
      color: randomColor(),
      createdAt: Date.now(),
      createdBy: user.customId,
      customId: newId(),
    };

    addNewValueToArrayField("labelList", label, {}, {});

    editingLabelList.add(label.customId);
    newLabelList.add(label.customId);
  }, [editingLabelList, newLabelList, user]);

  const renderAddControls = () => {
    return (
      <StyledContainer s={{ padding: "24px" }}>
        <Button
          disabled={
            isSubmitting ||
            formik.values.labelList.length >= blockConstants.maxAvailableLabels
          }
          icon={<PlusOutlined />}
          onClick={() => onAddNewLabel()}
        >
          New Label
        </Button>
      </StyledContainer>
    );
  };

  const renderMain = () => {
    return (
      <StyledContainerAsForm
        s={{ width: "100%", height: "100%", flexDirection: "column" }}
        onSubmit={formik.handleSubmit}
      >
        {renderAddControls()}
        {renderList()}
        {renderSubmitControls()}
      </StyledContainerAsForm>
    );
  };

  return renderMain();
};

LabelList.defaultProps = {
  labelList: [],
};

export default React.memo(LabelList);
