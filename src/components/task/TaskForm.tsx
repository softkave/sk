import { RightCircleTwoTone } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, DatePicker, Form, Input, List, Select, Switch } from "antd";
import { Formik, FormikProps } from "formik";
import moment from "moment";
import React from "react";
import {
  BlockPriority,
  BlockType,
  IBlock,
  ISubTask,
  ITaskCollaborationData,
  ITaskCollaborator,
} from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { indexArray } from "../../utils/object";
import BlockParentSelection from "../block/BlockParentSelection";
import CollaboratorThumbnail from "../collaborator/CollaboratorThumbnail";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormErrors } from "../form/formik-utils";
import { StyledForm } from "../form/FormStyledComponents";
import useInsertFormikErrors from "../hooks/useInsertFormikErrors";
import StyledButton from "../styled/Button";
import StyledContainer from "../styled/Container";
import EditPriority from "./EditPriority";
import { TaskPriority } from "./Priority";
import TaskCollaboratorThumbnail from "./TaskCollaboratorThumbnail";
import TaskLabels from "./TaskLabels";
import TaskStatus from "./TaskStatus";

export interface ITaskFormValues {
  // TODO: Should tasks have names and descriptions?
  // name: string;
  customId: string;
  type: BlockType;
  taskCollaborationData: ITaskCollaborationData;
  taskCollaborators: ITaskCollaborator[];
  expectedEndAt: number;
  description?: string;
  parent?: string;
  subTasks?: ISubTask[];
  priority?: BlockPriority;
  status?: string;
  labels?: string[];
}

type TaskFormFormikProps = FormikProps<ITaskFormValues>;
export type TaskFormErrors = IFormikFormErrors<ITaskFormValues>;

export interface ITaskFormProps {
  user: IUser;
  collaborators: IUser[];
  orgID: string;
  possibleParents: IBlock[];
  value: ITaskFormValues;
  onClose: () => void;
  onSubmit: (values: ITaskFormValues) => void;

  submitLabel?: React.ReactNode;
  isSubmitting?: boolean;
  errors?: TaskFormErrors;
}

const defaultSubmitLabel = "Create Task";
const StyledContainerAsLink = StyledContainer.withComponent("a");

const TaskForm: React.FC<ITaskFormProps> = (props) => {
  const {
    submitLabel,
    isSubmitting,
    possibleParents,
    onClose,
    value,
    onSubmit,
    collaborators,
    orgID,
    user,
    errors: externalErrors,
  } = props;

  const [indexedCollaborators] = React.useState(
    indexArray(props.collaborators, {
      path: "customId",
    })
  );

  const formikRef = useInsertFormikErrors(externalErrors);

  const renderParentInput = (formikProps: TaskFormFormikProps) => {
    const { touched, errors, values, setFieldValue } = formikProps;

    return (
      <Form.Item
        required
        label="Parent"
        help={touched.parent && <FormError error={errors.parent} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <BlockParentSelection
          value={values.parent}
          possibleParents={possibleParents}
          onChange={(val) => setFieldValue("parent", val)}
          disabled={isSubmitting}
        />
      </Form.Item>
    );
  };

  const renderDescriptionInput = (formikProps: TaskFormFormikProps) => {
    const { touched, handleBlur, values, errors, handleChange } = formikProps;

    return (
      <Form.Item
        required
        label="Description"
        help={touched.description && <FormError error={errors.description} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 6 }}
          autoComplete="off"
          name="description"
          placeholder="Enter task description"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.description}
          disabled={isSubmitting}
        />
      </Form.Item>
    );
  };

  const onChangeToggleSwitch = (formikProps: TaskFormFormikProps) => {
    const { values, setValues } = formikProps;
    const isCompleted = !!values.taskCollaborationData.completedAt;
    const now = Date.now();
    const update: ITaskFormValues = {
      ...values,
      taskCollaborationData: {
        ...values.taskCollaborationData,
        completedAt: isCompleted ? null : now,
        completedBy: isCompleted ? null : user.customId,
      },
    };
    const subTasks = update.subTasks;

    if (Array.isArray(subTasks) && subTasks.length > 0) {
      const newSubTasks = subTasks.map((subTask) => ({
        ...subTask,
        completedAt: isCompleted ? null : now,
        completedBy: isCompleted ? null : user.customId,
      }));

      update.subTasks = newSubTasks;
    }

    setValues(update);
  };

  const renderToggleSwitch = (formikProps: TaskFormFormikProps) => {
    const { values } = formikProps;

    return (
      <Form.Item
        label="Completed"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        labelAlign="left"
      >
        <Switch
          checked={!!values.taskCollaborationData.completedAt}
          onChange={() => onChangeToggleSwitch(formikProps)}
          disabled={isSubmitting}
        />
      </Form.Item>
    );
  };

  const renderPriority = (formikProps: TaskFormFormikProps) => {
    const { setFieldValue, values } = formikProps;

    return (
      <Form.Item
        label="Priority"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        labelAlign="left"
      >
        <EditPriority
          onChange={(val: string) => setFieldValue("priority", val)}
          value={values.priority as TaskPriority}
          disabled={isSubmitting}
        />
      </Form.Item>
    );
  };

  const renderStatus = (formikProps: TaskFormFormikProps) => {
    const { values, setFieldValue } = formikProps;

    return (
      <Form.Item
        label="Status"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        labelAlign="left"
      >
        <TaskStatus
          orgID={orgID}
          onChange={(val: string) => setFieldValue("status", val)}
          statusID={values.status}
          disabled={isSubmitting}
        />
      </Form.Item>
    );
  };

  // TODO: extract these fields into separate components with React.memo for speed
  const renderLabels = (formikProps: TaskFormFormikProps) => {
    const { values, setFieldValue } = formikProps;

    return (
      <Form.Item
        label="Labels"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        labelAlign="left"
      >
        <TaskLabels
          orgID={orgID}
          onChange={(val: string[]) => setFieldValue("labels", val)}
          labelIDs={values.labels}
          disabled={isSubmitting}
        />
      </Form.Item>
    );
  };

  const renderDueDateInput = (formikProps: TaskFormFormikProps) => {
    const { values, setFieldValue } = formikProps;

    return (
      <Form.Item
        label="Due Date"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        labelAlign="left"
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="Due date"
          onChange={(val) => {
            setFieldValue(
              "expectedEndAt",
              val ? val.hour(23).minute(59).second(0).valueOf() : null
            );
          }}
          value={
            values.expectedEndAt ? moment(values.expectedEndAt) : undefined
          }
          style={{ width: "100%" }}
          disabled={isSubmitting}
        />
      </Form.Item>
    );
  };

  const unassignCollaborator = (
    collaboratorData: ITaskCollaborator,
    taskCollaborators: ITaskCollaborator[]
  ) => {
    const index = taskCollaborators.findIndex((next) => {
      return next.userId === collaboratorData.userId;
    });

    if (index !== -1) {
      const updated = [...taskCollaborators];
      updated.splice(index, 1);
      return updated;
    }

    return taskCollaborators;
  };

  const assignCollaborator = (
    collaborator: IUser,
    taskCollaborators: ITaskCollaborator[]
  ): ITaskCollaborator[] => {
    const collaboratorExists = !!taskCollaborators.find((next) => {
      return collaborator.customId === next.userId;
    });

    if (!collaboratorExists) {
      return [
        ...taskCollaborators,
        {
          userId: collaborator.customId,
          assignedAt: Date.now(),
          assignedBy: user.customId,
        },
      ];
    }

    return taskCollaborators;
  };

  const renderTaskCollaborators = (formikProps: TaskFormFormikProps) => {
    const { values, setFieldValue } = formikProps;

    if (Array.isArray(values.taskCollaborators)) {
      if (values.taskCollaborators.length === 0) {
        return "Not assigned to anybody yet";
      }

      return (
        <List
          dataSource={values.taskCollaborators}
          renderItem={(item) => {
            return (
              <List.Item>
                <TaskCollaboratorThumbnail
                  key={item.userId}
                  collaborationType={
                    values.taskCollaborationData.collaborationType
                  }
                  collaborator={indexedCollaborators[item.userId]}
                  taskCollaborator={item}
                  onUnassign={() =>
                    setFieldValue(
                      "taskCollaborators",
                      unassignCollaborator(item, values.taskCollaborators)
                    )
                  }
                  disabled={isSubmitting}
                />
              </List.Item>
            );
          }}
        />
      );
    }

    return null;
  };

  const renderAssignedToInput = (formikProps: TaskFormFormikProps) => {
    const { setFieldValue, values } = formikProps;

    return (
      <Form.Item
        label="Assigned To"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Select
          placeholder="Select collaborator"
          value={undefined}
          onChange={(index) =>
            setFieldValue(
              "taskCollaborators",
              assignCollaborator(
                collaborators[Number(index)],
                values.taskCollaborators
              )
            )
          }
          disabled={isSubmitting}
        >
          {collaborators.map((collaborator, index) => {
            return (
              <Select.Option value={index} key={collaborator.customId}>
                <CollaboratorThumbnail collaborator={collaborator} />
              </Select.Option>
            );
          })}
        </Select>
        <StyledContainerAsLink
          role="button"
          onClick={() => {
            if (!isSubmitting) {
              setFieldValue(
                "taskCollaborators",
                assignCollaborator(user, values.taskCollaborators)
              );
            }
          }}
          s={{
            display: "block",
            lineHeight: "32px",
            cursor: isSubmitting ? "not-allowed" : undefined,
            color: isSubmitting ? "#f0f0f0" : undefined,
          }}
        >
          <RightCircleTwoTone /> Assign To Me
        </StyledContainerAsLink>
        <StyledTaskCollaboaratorsContainer>
          {renderTaskCollaborators(formikProps)}
        </StyledTaskCollaboaratorsContainer>
      </Form.Item>
    );
  };

  // const onChangeSubTasks = (
  //   subTasks: ISubTask[],
  //   formikProps: TaskFormFormikProps
  // ) => {
  //   const { values, setValues } = formikProps;
  //   const update: ITaskFormValues = { ...values, subTasks };
  //   const now = Date.now();

  //   if (Array.isArray(subTasks) && subTasks.length > 0) {
  //     const areSubTasksCompleted = !!!subTasks.find(
  //       (subTask) => !!!subTask.completedAt
  //     );

  //     if (areSubTasksCompleted !== !!values.taskCollaborationData.completedAt) {
  //       update.taskCollaborationData = {
  //         ...update.taskCollaborationData,
  //         completedAt: areSubTasksCompleted ? now : null,
  //         completedBy: areSubTasksCompleted ? user.customId : null,
  //       };
  //     }
  //   }

  //   setValues(update);
  // };

  // const renderSubTasks = (formikProps: TaskFormFormikProps) => {
  //   const { values, touched, errors } = formikProps;

  //   return (
  //     <StyledContainer
  //       s={{ flexDirection: "column", width: "100%", marginBottom: "24px" }}
  //     >
  //       <SubTaskList
  //         subTasks={values.subTasks || []}
  //         errors={touched.subTasks && (errors.subTasks as any)}
  //         onChange={(subTasks) => onChangeSubTasks(subTasks, formikProps)}
  //         disabled={isSubmitting}
  //       />
  //     </StyledContainer>
  //   );
  // };

  const renderForm = (formikProps: TaskFormFormikProps) => {
    const { handleSubmit, errors } = formikProps;
    const globalError = getGlobalError(errors);
    formikRef.current = formikProps;

    return (
      <StyledForm onSubmit={handleSubmit}>
        <StyledContainer
          s={{
            height: "100%",
            width: "100%",
            padding: "16px 24px 24px 24px",
            overflowY: "auto",
            flexDirection: "column",
          }}
        >
          {globalError && (
            <Form.Item>
              <FormError error={globalError} />
            </Form.Item>
          )}
          {renderParentInput(formikProps)}
          {renderDescriptionInput(formikProps)}
          {renderToggleSwitch(formikProps)}
          {renderPriority(formikProps)}
          {renderStatus(formikProps)}
          {renderLabels(formikProps)}
          {renderDueDateInput(formikProps)}
          {/* {renderCollaborationTypeInput(formikProps)} */}
          {renderAssignedToInput(formikProps)}
          {/* TODO: work on sub-tasks, there is a bug preventing adding tasks, and add disabled */}
          {/* TODO: pattern the implementation and UX like status and label lists */}
          {/* {renderSubTasks(formikProps)} */}
          <StyledContainer>
            <StyledButton
              block
              danger
              type="primary"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancel
            </StyledButton>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
            >
              {submitLabel || defaultSubmitLabel}
            </Button>
          </StyledContainer>
        </StyledContainer>
      </StyledForm>
    );
  };

  return (
    <Formik
      initialValues={value}
      // validationSchema={blockValidationSchemas.task}
      // TODO: show a message on form submit or close the form
      onSubmit={onSubmit}
    >
      {(formikProps) => renderForm(formikProps)}
    </Formik>
  );
};

const StyledTaskCollaboaratorsContainer = styled.div({
  marginBottom: 16,
});

TaskForm.defaultProps = {
  submitLabel: defaultSubmitLabel,
};

export default React.memo(TaskForm);
