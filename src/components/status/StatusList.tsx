import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import * as yup from "yup";
import { IBlockStatus } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { IUser } from "../../models/user/user";
import { newId } from "../../utils/utils";
import { IFormikFormErrors } from "../form/formik-utils";
import {
  formInputContentWrapperStyle,
  StyledForm,
} from "../form/FormStyledComponents";
import { validateWithYupSchema } from "../form/utils";
import useArray from "../hooks/useArray";
import useFormikExtended from "../hooks/useFormikExtended";
import { labelValidationSchemas } from "../label/validation";
import StyledContainer from "../styled/Container";
import StatusFormItem from "./StatusFormItem";

export interface IStatusListProps {
  user: IUser;
  statusList: IBlockStatus[];
  saveChanges: (statusList: IBlockStatus[]) => Promise<void>;

  errors?: IFormikFormErrors<IBlockStatus[]>;
  isSubmitting?: boolean;
}

const StatusList: React.FC<IStatusListProps> = (props) => {
  const { statusList, saveChanges, user, errors, isSubmitting } = props;
  const editingStatusList = useArray<string>();
  const newStatusList = useArray<string>();

  const onSubmit = (values: { statusList: IBlockStatus[] }) => {
    // TODO: should we alert the user before saving if they have editing statuses?

    editingStatusList.reset();
    newStatusList.reset();
    saveChanges(values.statusList);
  };

  const {
    formik,
    deleteIndexInArrayField,
    addNewValueToArrayField,
    moveIndexInArrayField,
  } = useFormikExtended({
    errors,
    formikProps: {
      initialValues: { statusList },
      onSubmit,
      validationSchema: yup.object().shape({
        statusList: labelValidationSchemas.labelList,
      }),
    },
  });

  const onDelete = (index: number) => {
    const status = formik.values.statusList[index];

    deleteIndexInArrayField("statusList", index);
    editingStatusList.remove(status.customId);
    newStatusList.remove(status.customId);
  };

  const onCommitChanges = (status: IBlockStatus, index: number) => {
    const err = validateWithYupSchema(
      labelValidationSchemas.label,
      formik.values.statusList[index]
    );

    if (err) {
      formik.setFieldTouched(`statusList.[${index}].name`, true);
      formik.setFieldTouched(`statusList.[${index}].description`, true);
      return;
    }

    editingStatusList.remove(status.customId);
    newStatusList.remove(status.customId);
  };

  const onDiscardChanges = (status: IBlockStatus, index: number) => {
    formik.setFieldValue(`statusList.[${index}]`, status);
    editingStatusList.remove(status.customId);
    newStatusList.remove(status.customId);
  };

  const onEdit = (id: string) => {
    editingStatusList.add(id);
  };

  const onChange = (index: number, data: Partial<IBlockStatus>) => {
    const nameField = `statusList.[${index}].name`;
    const descField = `statusList.[${index}].description`;

    if (data.name) {
      formik.setFieldValue(nameField, data.name);
    } else if (data.description) {
      formik.setFieldValue(descField, data.description);
    }
  };

  const handleBlur = (index: number, field: string) => {
    const fullField = `statusList.[${index}].${field}`;
    formik.handleBlur(fullField);
  };

  console.log({ formik });

  const renderStatusItem = (
    status: IBlockStatus,
    index: number,
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => {
    const isEditing = editingStatusList.exists(status.customId);
    const touched = (formik.touched.statusList || [])[index];
    const statusErrors: any = (formik.errors.statusList || [])[index];
    const values = formik.values.statusList[index];

    return (
      <StatusFormItem
        onChange={(data) => onChange(index, data)}
        onCommitChanges={() => onCommitChanges(status, index)}
        onDelete={() => onDelete(index)}
        onDiscardChanges={() => onDiscardChanges(status, index)}
        onEdit={() => onEdit(status.customId)}
        provided={provided}
        snapshot={snapshot}
        value={values}
        disabled={isSubmitting}
        errors={statusErrors}
        handleBlur={(field, evt) => handleBlur(index, field)}
        isEditing={isEditing}
        isNew={newStatusList.exists(status.customId)}
        touched={touched}
        style={{
          borderBottom:
            index < formik.values.statusList.length - 1
              ? "1px solid #f0f0f0"
              : undefined,
        }}
      />
    );
  };

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) {
      return;
    }

    // did not move anywhere - can bail early
    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    ) {
      return;
    }

    const srcIndex = result.source.index;
    const destIndex = result.destination?.index;

    moveIndexInArrayField("statusList", srcIndex, destIndex);
  };

  const renderList = () => {
    const statuses = formik.values.statusList.map((status, index) => {
      return (
        <Draggable
          key={status.customId}
          draggableId={status.customId}
          index={index}
          isDragDisabled={isSubmitting}
        >
          {(provided, snapshot) =>
            renderStatusItem(status, index, provided, snapshot)
          }
        </Draggable>
      );
    });

    return (
      <DragDropContext
        onDragEnd={(result, provided) => onDragEnd(result, provided)}
      >
        <Droppable
          droppableId="status-list"
          type="status"
          isDropDisabled={isSubmitting}
        >
          {(provided, snapshot) => {
            return (
              <StyledContainer
                ref={provided.innerRef}
                style={{
                  flexDirection: "column",
                  width: "100%",
                }}
                {...provided.droppableProps}
              >
                {statuses}
                {provided.placeholder}
              </StyledContainer>
            );
          }}
        </Droppable>
      </DragDropContext>
    );
  };

  // TODO: add cancel button
  const renderSubmitControls = () => {
    return (
      <StyledContainer
        s={{
          flexDirection: "column",
          width: "100%",
          padding: "24px",
        }}
      >
        <Button
          loading={isSubmitting}
          type="primary"
          // htmlType="submit"
          onClick={() => {
            formik.submitForm();
          }}
        >
          {isSubmitting ? "Saving Changes" : "Save Changes"}
        </Button>
      </StyledContainer>
    );
  };

  const onAddNewStatus = () => {
    const status: IBlockStatus = {
      name: "",
      description: "",
      createdAt: Date.now(),
      createdBy: user.customId,
      customId: newId(),
    };

    addNewValueToArrayField(
      "statusList",
      status,
      { name: "", description: "" },
      {}
    );
    editingStatusList.add(status.customId);
    newStatusList.add(status.customId);
  };

  const renderAddControls = () => {
    return (
      <StyledContainer s={{ padding: "24px" }}>
        <Button
          disabled={
            isSubmitting ||
            formik.values.statusList.length >= blockConstants.maxAvailableLabels
          }
          icon={<PlusOutlined />}
          onClick={() => onAddNewStatus()}
          htmlType="button"
        >
          New Status
        </Button>
      </StyledContainer>
    );
  };

  const renderMain = () => {
    return (
      <StyledForm onSubmit={formik.handleSubmit}>
        <StyledContainer
          s={{
            height: "100%",
            width: "100%",
            overflowY: "auto",
            flexDirection: "column",
          }}
        >
          <StyledContainer s={formInputContentWrapperStyle}>
            {renderAddControls()}
            {renderList()}
          </StyledContainer>
          {renderSubmitControls()}
        </StyledContainer>
      </StyledForm>
    );
  };

  return renderMain();
};

StatusList.defaultProps = {
  statusList: [],
};

export default React.memo(StatusList);
