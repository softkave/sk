import { RightCircleTwoTone } from "@ant-design/icons";
import styled from "@emotion/styled";
import {
  Button,
  DatePicker,
  Form,
  Input,
  List,
  Select,
  Typography,
} from "antd";
import { FormikProps } from "formik";
import moment from "moment";
import React from "react";
import {
  BlockPriority,
  BlockType,
  IBlock,
  IBlockAssignedLabel,
  ISubTask,
  ITaskCollaborator,
} from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { IUser } from "../../models/user/user";
import { indexArray } from "../../utils/object";
import { getDateString } from "../../utils/utils";
import BlockParentSelection from "../block/BlockParentSelection";
import blockValidationSchemas from "../block/validation";
import CollaboratorThumbnail from "../collaborator/CollaboratorThumbnail";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormErrors } from "../form/formik-utils";
import {
  formContentWrapperStyle,
  formInputContentWrapperStyle,
  StyledForm,
} from "../form/FormStyledComponents";
import useFormikExtended from "../hooks/useFormikExtended";
import StyledButton from "../styled/Button";
import StyledContainer from "../styled/Container";
import EditPriority from "./EditPriority";
import { TaskPriority } from "./Priority";
import SubTaskList from "./SubTaskList";
import TaskCollaboratorThumbnail from "./TaskCollaboratorThumbnail";
import TaskLabels from "./TaskLabels";
import TaskStatus from "./TaskStatus";

export interface ITaskFormValues {
  // TODO: Should tasks have names and descriptions?
  // name: string;
  customId: string;
  type: BlockType;
  assignees: ITaskCollaborator[];
  expectedEndAt: number;
  description?: string;
  parent?: string;
  subTasks?: ISubTask[];
  priority?: BlockPriority;
  status?: string;
  labels?: IBlockAssignedLabel[];
}

type TaskFormFormikProps = FormikProps<ITaskFormValues>;
export type TaskFormErrors = IFormikFormErrors<ITaskFormValues>;

export interface ITaskFormProps {
  user: IUser;
  collaborators: IUser[];
  orgId: string;
  possibleParents: IBlock[];
  value: ITaskFormValues;
  onClose: () => void;
  onSubmit: (values: ITaskFormValues) => void;

  formOnly?: boolean;
  task?: IBlock;
  isSubmitting?: boolean;
  errors?: TaskFormErrors;
}

const StyledContainerAsLink = StyledContainer.withComponent("a");

const TaskForm: React.FC<ITaskFormProps> = (props) => {
  const {
    formOnly,
    task,
    isSubmitting,
    possibleParents,
    onClose,
    value,
    onSubmit,
    collaborators,
    orgId,
    user,
    errors: externalErrors,
  } = props;

  const [indexedCollaborators] = React.useState(
    indexArray(props.collaborators, {
      path: "customId",
    })
  );

  const {
    formik,
    addNewValueToArrayField,
    deleteIndexInArrayField,
  } = useFormikExtended({
    errors: externalErrors,
    formikProps: {
      // TODO: show a message on form submit or close the form
      onSubmit,
      initialValues: value,
      validationSchema: blockValidationSchemas.task,
    },
  });

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
        {formOnly ? (
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            autoComplete="off"
            name="description"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.description}
            placeholder="Enter task description"
            disabled={isSubmitting}
            maxLength={blockConstants.maxDescriptionLength}
          />
        ) : (
          <Typography.Paragraph
            editable={{
              onChange: (val) => {
                formikProps.setFieldValue("description", val);
              },
            }}
          >
            {values.description || ""}
          </Typography.Paragraph>
        )}
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
          orgId={orgId}
          onChange={(val: string) => setFieldValue("status", val)}
          statusId={values.status}
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
          orgId={orgId}
          user={user}
          onChange={(val: IBlockAssignedLabel[]) =>
            setFieldValue("labels", val)
          }
          labels={values.labels}
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
          assignedAt: getDateString(),
          assignedBy: user.customId,
        },
      ];
    }

    return taskCollaborators;
  };

  const renderTaskCollaborators = (formikProps: TaskFormFormikProps) => {
    const { values, setFieldValue } = formikProps;

    if (Array.isArray(values.assignees)) {
      if (values.assignees.length === 0) {
        return "Not assigned to anybody yet";
      }

      return (
        <List
          dataSource={values.assignees}
          renderItem={(item) => {
            return (
              <List.Item>
                <TaskCollaboratorThumbnail
                  key={item.userId}
                  collaborator={indexedCollaborators[item.userId]}
                  onUnassign={() =>
                    setFieldValue(
                      "taskCollaborators",
                      unassignCollaborator(item, values.assignees)
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
              assignCollaborator(collaborators[Number(index)], values.assignees)
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
                assignCollaborator(user, values.assignees)
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

  const onChangeSubTasks = (
    subTasks: ISubTask[],
    formikProps: TaskFormFormikProps
  ) => {
    const { values, setValues } = formikProps;
    const update: ITaskFormValues = { ...values, subTasks };

    setValues(update);
  };

  const onDiscardSubTaskChanges = (index: number) => {
    const taskInitialValue = formik.initialValues || {};
    const initialSubTasks = taskInitialValue.subTasks || [];
    const initialValue = initialSubTasks[index];

    if (initialValue) {
      formik.setFieldValue(`subTasks.[${index}]`, initialValue);
    }
  };

  const renderSubTasks = (formikProps: TaskFormFormikProps) => {
    const { values, touched, errors } = formikProps;
    console.log({ errors, touched });

    return (
      <StyledContainer
        s={{ flexDirection: "column", width: "100%", marginBottom: "24px" }}
      >
        <SubTaskList
          user={user}
          subTasks={values.subTasks || []}
          errors={errors.subTasks as any}
          touched={touched.subTasks as any}
          onChange={(subTasks) => onChangeSubTasks(subTasks, formikProps)}
          disabled={isSubmitting}
          onAddSubTask={(subTask) => {
            addNewValueToArrayField("subTasks", subTask, {}, {});
          }}
          onDeleteSubTask={(index) => {
            deleteIndexInArrayField("subTasks", index);
          }}
          onDiscardSubTaskChanges={onDiscardSubTaskChanges}
        />
      </StyledContainer>
    );
  };

  const getSubmitLabel = () => {
    if (isSubmitting) {
      if (task) {
        return "Saving Changes";
      } else {
        return "Creating Task";
      }
    } else {
      if (task) {
        return "Save Changes";
      } else {
        return "Create Task";
      }
    }
  };

  const renderControls = () => {
    return (
      <StyledContainer>
        <StyledButton
          block
          danger
          type="primary"
          disabled={isSubmitting}
          onClick={onClose}
        >
          Close
        </StyledButton>
        <Button block type="primary" htmlType="submit" loading={isSubmitting}>
          {getSubmitLabel()}
        </Button>
      </StyledContainer>
    );
  };

  const renderForm = (formikProps: TaskFormFormikProps) => {
    const { handleSubmit, errors } = formikProps;
    const globalError = getGlobalError(errors);

    return (
      <StyledForm onSubmit={handleSubmit}>
        <StyledContainer s={formContentWrapperStyle}>
          <StyledContainer s={formInputContentWrapperStyle}>
            {globalError && (
              <Form.Item>
                <FormError error={globalError} />
              </Form.Item>
            )}
            {renderDescriptionInput(formikProps)}
            {renderParentInput(formikProps)}
            {/* {renderToggleSwitch(formikProps)} */}
            {renderPriority(formikProps)}
            {renderStatus(formikProps)}
            {renderLabels(formikProps)}
            {renderDueDateInput(formikProps)}
            {/* {renderCollaborationTypeInput(formikProps)} */}
            {renderAssignedToInput(formikProps)}
            {/* TODO: work on sub-tasks, there is a bug preventing adding tasks, and add disabled */}
            {renderSubTasks(formikProps)}
          </StyledContainer>
          {renderControls()}
        </StyledContainer>
      </StyledForm>
    );
  };

  return renderForm(formik);
};

const StyledTaskCollaboaratorsContainer = styled.div({
  marginBottom: 16,
});

export default React.memo(TaskForm);
