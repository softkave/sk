import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space } from "antd";
import { Formik } from "formik";
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
import { Check, X as CloseIcon } from "react-feather";
import * as yup from "yup";
import { IBlockStatus } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { IUser } from "../../models/user/user";
import { newId } from "../../utils/utils";
import FormError from "../form/FormError";
import { IFormikFormErrors } from "../form/formik-utils";
import { StyledForm } from "../form/FormStyledComponents";
import useInsertFormikErrors from "../hooks/useInsertFormikErrors";
import { labelValidationSchemas } from "../label/validation";
import StyledContainer from "../styled/Container";
import { StatusListFormikProps } from "./types";

export interface IStatusListProps {
  user: IUser;
  statusList: IBlockStatus[];
  saveChanges: (statusList: IBlockStatus[]) => Promise<void>;

  errors?: IFormikFormErrors<IBlockStatus[]>;
  isSubmitting?: boolean;
}

const StatusList: React.FC<IStatusListProps> = (props) => {
  const { statusList, saveChanges, user, errors, isSubmitting } = props;
  const [newStatuses, setNewStatuses] = React.useState<string[]>([]);
  const [editingStatus, setEditingStatus] = React.useState<string[]>(() => {
    return [];
  });

  const formikRef = useInsertFormikErrors(errors);

  const onDelete = React.useCallback(
    (formikProps: StatusListFormikProps, index: number) => {
      const newStatusList = [...formikProps.values.statusList];
      const status = newStatusList[index];
      const statusListTouched = [
        ...Array.from(formikProps.touched?.statusList || []),
      ];

      const statusListErrors = [
        ...Array.from((formikProps.errors?.statusList as any[]) || []),
      ];

      newStatusList.splice(index, 1);
      statusListTouched.splice(index, 1);
      statusListErrors.splice(index, 1);

      formikProps.setTouched({ statusList: statusListTouched });
      formikProps.setErrors({ statusList: statusListErrors });
      formikProps.setFieldValue("statusList", newStatusList);

      if (editingStatus.indexOf(status.customId) !== -1) {
        const newEditingStatus = [...editingStatus];
        newEditingStatus.splice(editingStatus.indexOf(status.customId), 1);
        setEditingStatus(newEditingStatus);
      }

      if (newStatuses.indexOf(status.customId) >= 0) {
        const newNewStatus = [...newStatuses];
        newNewStatus.splice(newNewStatus.indexOf(status.customId), 1);
        setNewStatuses(newNewStatus);
      }
    },
    [editingStatus, newStatuses]
  );

  // const checkNameConflicts = (
  //   formikProps: StatusListFormikProps,
  //   statusIndex?: number
  // ) => {
  //   const nameToStatusMap = indexArray(formikProps.values.statusList, {
  //     path: "name",
  //     indexer: (status: IBlockStatus) => status.name.toLowerCase(),
  //     proccessValue: (status: IBlockStatus, u1, u2, index: number) => {
  //       return {
  //         status,
  //         index,
  //       };
  //     },
  //   });

  //   const checkErrors: StatusListFormikErrors = { statusList: [] };

  //   const pushError = (status: IBlockStatus, index: number) => {
  //     const existingError: any =
  //       (formikProps.errors.statusList || [])[index] || {};

  //     if (existingError.name) {
  //       // @ts-ignore
  //       checkErrors.statusList.push(existingError);
  //       return;
  //     }

  //     const statusDataWithNameConflict =
  //       nameToStatusMap[status.name.toLowerCase()];

  //     if (
  //       statusDataWithNameConflict &&
  //       statusDataWithNameConflict.index !== index
  //     ) {
  //       // @ts-ignore
  //       checkErrors.statusList.push({
  //         ...existingError,
  //         name: "Status name exists",
  //       });
  //     } else if (existingError) {
  //       // @ts-ignore
  //       checkErrors.statusList.push(existingError);
  //     }
  //   };

  //   if (isNumber(statusIndex) && statusIndex >= 0) {
  //     pushError(formikProps.values.statusList[statusIndex], statusIndex);
  //   } else {
  //     formikProps.values.statusList.forEach((status, index) => {
  //       pushError(status, index);
  //     });
  //   }

  //   return checkErrors;
  // };

  const renderEditingStatus = (
    formikProps: StatusListFormikProps,
    index: number
  ) => {
    const touched = (formikProps.touched.statusList || [])[index];
    const statusErrors: any =
      (formikProps.errors.statusList || [])[index] || {};
    const values = formikProps.values.statusList[index];
    const nameField = `statusList.[${index}].name`;
    const descField = `statusList.[${index}].description`;

    return (
      <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
        <Form.Item
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          help={
            touched?.name &&
            statusErrors.name && <FormError>{statusErrors.name}</FormError>
          }
          style={{
            marginBottom: "4px",
          }}
        >
          <Input
            autoComplete="off"
            onBlur={formikProps.handleBlur}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value;
              formikProps.setFieldValue(nameField, value);
            }}
            name={nameField}
            value={values.name}
            placeholder="Enter status name"
            disabled={isSubmitting}
          />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          help={
            touched?.description &&
            statusErrors.description && (
              <FormError>{statusErrors.description}</FormError>
            )
          }
          style={{
            marginBottom: "0px",
          }}
        >
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            autoComplete="off"
            onBlur={formikProps.handleBlur}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              const value = event.target.value;
              formikProps.setFieldValue(descField, value);
            }}
            name={descField}
            value={values.description}
            placeholder="Enter status description"
            disabled={isSubmitting}
          />
        </Form.Item>
      </StyledContainer>
    );
  };

  const renderRegularStatus = (
    formikProps: StatusListFormikProps,
    index: number
  ) => {
    const values = formikProps.values.statusList[index];
    return (
      <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
        <StyledContainer
          style={{
            color: "rgba(0,0,0,0.85)",
          }}
        >
          {values.name}
        </StyledContainer>
        <StyledContainer s={{ marginTop: "4px" }}>
          {values.description}
        </StyledContainer>
      </StyledContainer>
    );
  };

  const renderStatusButtons = (
    formikProps: StatusListFormikProps,
    status: IBlockStatus,
    index: number,
    isEditing: boolean
  ) => {
    const validateField = () => {
      try {
        labelValidationSchemas.label.validateSync(
          formikProps.values.statusList[index],
          { abortEarly: false }
        );

        return false;
      } catch (e) {
        const err: any = {};

        if (Array.isArray(e.inner) && e.inner.length > 0) {
          e.inner.forEach((er) => {
            if (!err[er.path]) {
              err[er.path] = er.message;
            }
          });
        } else {
          err[e.path] = e.message;
        }

        return err;
      }
    };

    if (isEditing) {
      return (
        <React.Fragment>
          <Button
            icon={<Check />}
            onClick={() => {
              const e = validateField();

              if (e) {
                formikProps.setFieldTouched(`statusList.[${index}].name`, true);
                formikProps.setFieldTouched(
                  `statusList.[${index}].description`,
                  true
                );
                return;
              }

              const newEditingStatus = [...editingStatus];
              newEditingStatus.splice(
                editingStatus.indexOf(status.customId),
                1
              );
              setEditingStatus(newEditingStatus);

              if (newStatuses.indexOf(status.customId) >= 0) {
                const newNewStatus = [...newStatuses];
                newNewStatus.splice(newNewStatus.indexOf(status.customId), 1);
                setNewStatuses(newNewStatus);
              }
            }}
            htmlType="button"
            disabled={isSubmitting}
          />
          <Button
            onClick={() => {
              const e = validateField();

              if (e) {
                formikProps.setFieldTouched(`statusList.[${index}].name`, true);
                formikProps.setFieldTouched(
                  `statusList.[${index}].description`,
                  true
                );
                return;
              }

              formikProps.setFieldValue(`statusList.[${index}]`, status);
              const a = [...editingStatus];
              a.splice(editingStatus.indexOf(status.customId), 1);
              setEditingStatus(a);

              if (newStatuses.indexOf(status.customId) >= 0) {
                const newNewStatus = [...newStatuses];
                newNewStatus.splice(newNewStatus.indexOf(status.customId), 1);
                setNewStatuses(newNewStatus);
              }
            }}
            icon={<CloseIcon style={{ fontSize: "14px" }} />}
            disabled={
              isSubmitting || newStatuses.indexOf(status.customId) !== -1
            }
            htmlType="button"
          />
        </React.Fragment>
      );
    } else {
      return (
        <Button
          disabled={isSubmitting}
          icon={<EditOutlined />}
          onClick={() => {
            setEditingStatus([...editingStatus, status.customId]);
          }}
          htmlType="button"
        />
      );
    }
  };

  const renderStatus = (
    formikProps: StatusListFormikProps,
    status: IBlockStatus,
    index: number,
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => {
    const isEditing = editingStatus.indexOf(status.customId) >= 0;

    return (
      <StyledContainer
        key={status.customId}
        s={{
          alignItems: "flex-start",
          width: "100%",
          padding: "24px",
          // borderTop: index === 0 ? "1px solid #f0f0f0" : undefined,
          borderBottom: "1px solid #f0f0f0",
        }}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          backgroundColor: snapshot.isDragging ? "#eee" : undefined,
          cursor: snapshot.isDragging ? "grabbing" : undefined,
          ...provided.draggableProps.style,
        }}
      >
        <StyledContainer
          s={{ flexDirection: "column", flex: 1, marginRight: "16px" }}
        >
          {isEditing
            ? renderEditingStatus(formikProps, index)
            : renderRegularStatus(formikProps, index)}
        </StyledContainer>
        <StyledContainer>
          <Space>
            {renderStatusButtons(formikProps, status, index, isEditing)}
            <Button
              danger
              disabled={isSubmitting}
              icon={<DeleteOutlined />}
              onClick={() => onDelete(formikProps, index)}
              htmlType="button"
            />
          </Space>
        </StyledContainer>
      </StyledContainer>
    );
  };

  const onDragEnd = React.useCallback(
    (
      result: DropResult,
      provided: ResponderProvided,
      formikProps: StatusListFormikProps
    ) => {
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

      const statusListValues = [...formikProps.values.statusList];
      const statusListTouched = [
        ...Array.from(formikProps.touched?.statusList || []),
      ];

      const statusListErrors = [
        ...Array.from((formikProps.errors?.statusList as any[]) || []),
      ];
      const status = statusListValues[srcIndex];
      const statusTouched = statusListTouched[srcIndex];
      const statusErrors = statusListErrors[srcIndex];

      statusListValues.splice(srcIndex, 1);
      statusListValues.splice(destIndex, 0, status);
      statusListTouched.splice(srcIndex, 1);
      statusListTouched.splice(destIndex, 0, statusTouched);
      statusListErrors.splice(srcIndex, 1);
      statusListErrors.splice(destIndex, 0, statusErrors);

      formikProps.setValues({ statusList: statusListValues });
      formikProps.setErrors({ statusList: statusListErrors });
      formikProps.setTouched({ statusList: statusListTouched });
    },
    []
  );

  const renderList = (formikProps: StatusListFormikProps) => {
    const statuses = formikProps.values.statusList.map((status, index) => {
      return (
        <Draggable
          key={status.customId}
          draggableId={status.customId}
          index={index}
          isDragDisabled={isSubmitting}
        >
          {(provided, snapshot) =>
            renderStatus(formikProps, status, index, provided, snapshot)
          }
        </Draggable>
      );
    });

    return (
      <DragDropContext
        onDragEnd={(result, provided) =>
          onDragEnd(result, provided, formikProps)
        }
      >
        <Droppable
          droppableId="status-list"
          type="status"
          // direction="horizontal"
          isDropDisabled={isSubmitting}
        >
          {(provided, snapshot) => {
            return (
              <StyledContainer
                ref={provided.innerRef}
                style={{
                  flexDirection: "column",
                  width: "100%",
                  flex: 1,
                  overflowY: "auto",
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
  const renderSubmitControls = (formikProps: StatusListFormikProps) => {
    return (
      <StyledContainer
        s={{
          flexDirection: "column",
          width: "100%",
          padding: "24px",
        }}
      >
        <Button
          // disabled={isSubmitting}
          loading={isSubmitting}
          type="primary"
          htmlType="submit"
          onClick={(evt: React.MouseEvent<HTMLFormElement>) => {
            // TODO: should we check name conflicts?
            // const submitErrors: StatusListFormikErrors = checkNameConflicts(
            //   formikProps
            // );
            // if (submitErrors) {
            //   // TODO: navigate to the first error in the list
            //   evt.preventDefault();
            //   formikProps.setErrors(submitErrors);
            // }

            formikProps.setTouched({
              statusList: formikProps.values.statusList.map((status) => ({
                name: true,
                description: true,
              })),
            });
          }}
        >
          Save Changes
        </Button>
      </StyledContainer>
    );
  };

  const onAddNewStatus = React.useCallback(
    (formikProps: StatusListFormikProps) => {
      const status: IBlockStatus = {
        name: "",
        description: "",
        createdAt: Date.now(),
        createdBy: user.customId,
        customId: newId(),
      };

      const statusListTouched = [
        ...Array.from(formikProps.touched?.statusList || []),
      ];

      const statusListErrors = [
        ...Array.from((formikProps.errors?.statusList as any[]) || []),
      ];
      const newStatusList = [...formikProps.values.statusList];
      newStatusList.unshift(status);
      statusListTouched.unshift({});
      statusListErrors.unshift({ name: "", description: "" });

      formikProps.setTouched({ statusList: statusListTouched });
      formikProps.setErrors({ statusList: statusListErrors });
      formikProps.setFieldValue("statusList", newStatusList);

      const newEditingStatus = [...editingStatus];
      newEditingStatus.unshift(status.customId);
      setEditingStatus(newEditingStatus);

      const newNewStatus = [...newStatuses];
      newNewStatus.unshift(status.customId);
      setNewStatuses(newNewStatus);
    },
    [editingStatus, newStatuses, user]
  );

  const renderAddControls = (formikProps: StatusListFormikProps) => {
    return (
      <StyledContainer
        s={{ padding: "24px", borderBottom: "1px solid #f0f0f0" }}
      >
        <Button
          disabled={
            isSubmitting ||
            formikProps.values.statusList.length >=
              blockConstants.maxAvailableLabels
          }
          icon={<PlusOutlined />}
          onClick={() => onAddNewStatus(formikProps)}
          htmlType="button"
        >
          New Status
        </Button>
      </StyledContainer>
    );
  };

  const renderMain = (formikProps: StatusListFormikProps) => {
    formikRef.current = formikProps;

    return (
      <StyledForm onSubmit={formikProps.handleSubmit}>
        <StyledContainer
          s={{
            height: "100%",
            width: "100%",
            // padding: "16px 24px 24px 24px",
            // paddingBottom: "24px",
            overflowY: "auto",
            flexDirection: "column",
          }}
        >
          {renderAddControls(formikProps)}
          {renderList(formikProps)}
          {renderSubmitControls(formikProps)}
        </StyledContainer>
      </StyledForm>
    );
  };

  const onSubmit = (values: { statusList: IBlockStatus[] }) => {
    // TODO: should we alert the user before saving if they have editing statuses?

    setEditingStatus([]);
    setNewStatuses([]);

    // return;
    saveChanges(values.statusList);
  };

  return (
    <Formik
      initialValues={{ statusList }}
      onSubmit={onSubmit}
      validationSchema={yup.object().shape({
        statusList: labelValidationSchemas.labelList,
      })}
    >
      {(formikProps) => renderMain(formikProps)}
    </Formik>
  );
};

StatusList.defaultProps = {
  statusList: [],
};

export default React.memo(StatusList);
