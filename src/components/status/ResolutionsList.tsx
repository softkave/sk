import { Button, Divider, Typography } from "antd";
import { FormikErrors } from "formik";
import { noop } from "lodash";
import React from "react";
import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import { IBoardStatusResolutionInput } from "../../models/board/types";
import { getNewId } from "../../utils/ids";
import useArray from "../hooks/useArray";
import useFormHelpers from "../hooks/useFormHelpers";
import { labelValidationSchemas } from "../label/validation";
import Scrollbar from "../utils/Scrollbar";
import { getFormikTouched, validateWithYupSchema } from "../utils/form/utils";
import ListHeader from "../utils/list/ListHeader";
import ResolutionFormItem from "./ResolutionFormItem";

export interface IResolutionsListProps {
  resolutionsList: IBoardStatusResolutionInput[];
  saveChanges: (resolutionsList: IBoardStatusResolutionInput[]) => Promise<void>;
  canUpdate: boolean;
  errors?: FormikErrors<{ resolutionsList: IBoardStatusResolutionInput[] }>;
  isSubmitting?: boolean;
}

const ResolutionsList: React.FC<IResolutionsListProps> = (props) => {
  const { resolutionsList, saveChanges, errors, isSubmitting, canUpdate } = props;
  const editingResolutionsList = useArray<string>();
  const newResolutionsList = useArray<string>();

  const onSubmit = (values: { resolutionsList: IBoardStatusResolutionInput[] }) => {
    // TODO: should we alert the user before saving if they have editing items?
    editingResolutionsList.reset();
    saveChanges(values.resolutionsList);
  };

  // TODO: form still shows error that come from server when submitting
  // should it even be allowed to submit, considering there is an error?
  const { formik, formikHelpers } = useFormHelpers({
    errors,
    formikProps: {
      initialValues: { resolutionsList },
      onSubmit,
      validationSchema: yup.object().shape({
        resolutionsList: labelValidationSchemas.labelList,
      }),
      validateOnBlur: true,
      validateOnChange: true,
    },
  });

  React.useEffect(() => {
    const processErrors = () => {
      if (errors && errors.resolutionsList) {
        const newEditingList: string[] = [];

        (errors.resolutionsList as any).forEach((e, i) => {
          if (e) {
            const resolution = formik.values.resolutionsList[i];

            if (!editingResolutionsList.exists(resolution.customId)) {
              newEditingList.push(resolution.customId);
            }
          }
        });

        if (newEditingList.length > 0) {
          editingResolutionsList.setList(newEditingList);
        }
      }
    };

    processErrors();
  }, [errors, formik.values.resolutionsList, editingResolutionsList]);

  const onCommitChanges = (resolution: IBoardStatusResolutionInput, index: number) => {
    const err = validateWithYupSchema(
      labelValidationSchemas.label,
      formik.values.resolutionsList[index]
    );

    if (err) {
      formik.setFieldTouched(`resolutionsList.[${index}]`, getFormikTouched(err) as any, true);

      formik.setFieldError(`resolutionsList.[${index}]`, err);
      return;
    }

    editingResolutionsList.remove(resolution.customId);
  };

  const onDiscardChanges = (index: number, initialValue?: IBoardStatusResolutionInput) => {
    if (initialValue) {
      formik.setFieldValue(`resolutionsList.[${index}]`, initialValue);
      editingResolutionsList.remove(initialValue.customId);
    }
  };

  const onEdit = (id: string) => {
    editingResolutionsList.add(id);
  };

  const onChange = (index: number, data: Partial<IBoardStatusResolutionInput>) => {
    const changedFields = Object.keys(data);
    const nameField = `resolutionsList.[${index}].name`;
    const descField = `resolutionsList.[${index}].description`;

    if (changedFields.includes("name")) {
      formik.setFieldValue(nameField, data.name, true);
    }

    if (changedFields.includes("description")) {
      formik.setFieldValue(descField, data.description, true);
    }
  };

  const handleBlur = (index: number, field: string) => {
    const fullField = `resolutionsList.[${index}].${field}`;
    formik.handleBlur(fullField);
  };

  const getInitialValue = (id: string) => {
    return formik.initialValues.resolutionsList.find((status) => status.customId === id);
  };

  const onDelete = React.useCallback(
    (index: number) => {
      const resolution = formik.values.resolutionsList[index];
      formikHelpers.deleteInArrayField("resolutionsList", index);
      editingResolutionsList.remove(resolution.customId);
    },
    [editingResolutionsList, formik.values.resolutionsList, formikHelpers]
  );

  const renderResolutionItem = (resolution: IBoardStatusResolutionInput, index: number) => {
    const isEditing = editingResolutionsList.exists(resolution.customId);
    const touched = (formik.touched.resolutionsList || [])[index];
    const resolutionErrors: any = (formik.errors.resolutionsList || [])[index] || {};
    const initialValue = getInitialValue(resolution.customId);

    return (
      <React.Fragment key={resolution.customId}>
        <ResolutionFormItem
          onChange={(data) => {
            onChange(index, data);
          }}
          onCommitChanges={() => onCommitChanges(resolution, index)}
          onDelete={() => onDelete(index)}
          onDiscardChanges={() => onDiscardChanges(index, initialValue)}
          onEdit={() => onEdit(resolution.customId)}
          value={resolution}
          disabled={isSubmitting || !canUpdate}
          errors={resolutionErrors}
          handleBlur={(field) => handleBlur(index, field)}
          isEditing={isEditing}
          isNew={newResolutionsList.exists(resolution.customId)}
          touched={touched}
        />
        <Divider />
      </React.Fragment>
    );
  };

  const renderList = () => {
    const resolutions = formik.values.resolutionsList.map((resolution, index) => {
      return renderResolutionItem(resolution, index);
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
        {resolutions}
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
        <Button block loading={isSubmitting} type="primary" htmlType="submit" disabled={!canUpdate}>
          Save Changes
        </Button>
      </div>
    );
  };

  const onAddNewResolution = React.useCallback(() => {
    const resolution: IBoardStatusResolutionInput = {
      name: "",
      description: "",
      customId: getNewId(),
    };

    formikHelpers.addToArrayField("resolutionsList", resolution, {}, {});
    editingResolutionsList.add(resolution.customId);
    newResolutionsList.add(resolution.customId);
  }, [editingResolutionsList, newResolutionsList, formikHelpers]);

  const renderAddControls = () => {
    return (
      <ListHeader
        hideSearchButton
        hideAddButton={!canUpdate}
        onCreate={onAddNewResolution}
        onSearchTextChange={noop}
        title="Resolutions"
        style={{ padding: "16px", paddingTop: "8px" }}
        disabled={
          isSubmitting || formik.values.resolutionsList.length >= blockConstants.maxAvailableLabels
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
        onSubmit={(e) => {
          formik.handleSubmit(e);
        }}
      >
        {renderAddControls()}
        <Scrollbar>
          <Typography.Paragraph type="secondary" style={{ padding: "16px" }}>
            Resolutions describe the state of a completed task, like "won't do" or in the case of a
            tech product, "deployed" meaning the task or feature has been deployed.
          </Typography.Paragraph>
          {renderList()}
          {renderSubmitControls()}
        </Scrollbar>
      </form>
    );
  };

  return renderMain();
};

ResolutionsList.defaultProps = {
  resolutionsList: [],
};

export default React.memo(ResolutionsList);
