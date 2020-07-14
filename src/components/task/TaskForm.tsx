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
import React, { useRef } from "react";
import {
  IBlock,
  IBlockAssignedLabel,
  IBlockLabel,
  IBlockStatus,
  ISubTask,
  ITaskAssignee,
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
import useFormHelpers from "../hooks/useFormHelpers";
import StyledButton from "../styled/Button";
import StyledContainer from "../styled/Container";
import EditPriority from "./EditPriority";
import { TaskPriority } from "./Priority";
import SubTaskList from "./SubTaskList";
import TaskCollaboratorThumbnail from "./TaskCollaboratorThumbnail";
import TaskLabels from "./TaskLabels";
import TaskStatus from "./TaskStatus";

export interface ITaskFormValues extends Partial<IBlock> {}

type TaskFormFormikProps = FormikProps<ITaskFormValues>;
export type TaskFormErrors = IFormikFormErrors<ITaskFormValues>;

export interface ITaskFormProps {
  user: IUser;
  collaborators: IUser[];
  statusList: IBlockStatus[];
  labelList: IBlockLabel[];
  possibleParents: IBlock[];
  value: ITaskFormValues;
  onClose: () => void;
  onSubmit: (values: ITaskFormValues) => void;
  onChangeParent: (parentId: string) => void;

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
    statusList,
    labelList,
    user,
    errors: externalErrors,
  } = props;

  const descriptionTextAreaRef = useRef<typeof Input.TextArea | null>();
  const [indexedCollaborators] = React.useState(
    indexArray(props.collaborators, {
      path: "customId",
    })
  );

  React.useEffect(() => {
    if (descriptionTextAreaRef.current) {
      // @ts-ignore
      descriptionTextAreaRef.current.focus();
    }
  }, []);

  const { formik, formikHelpers } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      // TODO: show a message on form submit or close the form
      onSubmit,
      initialValues: value,
      validationSchema: formOnly
        ? blockValidationSchemas.newTask
        : blockValidationSchemas.updateTask,
    },
  });

  const status = formik.values.status;

  React.useEffect(() => {
    if (!status && statusList.length > 0) {
      formik.setValues({
        ...formik.values,
        status: statusList[0].customId,
        statusAssignedAt: getDateString(),
        statusAssignedBy: user.customId,
      });
    }
  }, [statusList, status]);

  const onChangeParent = (parentId: string) => {
    if (parentId === formik.values.parent) {
      return;
    }

    if (parentId === task?.parent) {
      formik.setValues({
        ...formik.values,
        parent: parentId,
        labels: task.labels,
        status: task.status,
        statusAssignedAt: task.statusAssignedAt,
        statusAssignedBy: task.statusAssignedBy,
      });
      return;
    }

    formik.setValues({
      ...formik.values,
      parent: parentId,
      labels: [],
      status: undefined,
      statusAssignedAt: undefined,
      statusAssignedBy: undefined,
    });
  };

  const renderParentInput = (formikProps: TaskFormFormikProps) => {
    const { touched, errors, values, setFieldValue } = formikProps;

    return (
      <Form.Item
        label="Parent"
        help={touched.parent && <FormError error={errors.parent} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <BlockParentSelection
          value={values.parent}
          possibleParents={possibleParents}
          onChange={(val) => onChangeParent(val)}
          disabled={isSubmitting}
        />
      </Form.Item>
    );
  };

  const renderNameInput = () => {
    const { touched, values, errors } = formik;

    return (
      <Form.Item
        label="Task"
        help={touched.name && <FormError error={errors.name} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        {formOnly ? (
          <Input
            autoComplete="off"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={values.name}
            placeholder="Task"
            disabled={isSubmitting}
            maxLength={blockConstants.maxNameLength}
          />
        ) : (
          <Typography.Paragraph
            editable={{
              onChange: (val) => {
                formik.setFieldValue("name", val);
              },
            }}
          >
            {values.name}
          </Typography.Paragraph>
        )}
      </Form.Item>
    );
  };

  const renderDescriptionInput = (formikProps: TaskFormFormikProps) => {
    const { touched, handleBlur, values, errors, handleChange } = formikProps;

    return (
      <Form.Item
        label="Description"
        help={touched.description && <FormError error={errors.description} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        {formOnly ? (
          <Input.TextArea
            ref={descriptionTextAreaRef as any}
            autoSize={{ minRows: 2, maxRows: 6 }}
            autoComplete="off"
            name="description"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.description}
            placeholder="Description"
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
    const { values, setValues } = formikProps;

    return (
      <Form.Item
        label="Status"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        labelAlign="left"
      >
        <TaskStatus
          statusList={statusList}
          onChange={(val: string) => {
            setValues({
              ...values,
              status: val,
              statusAssignedAt: getDateString(),
              statusAssignedBy: user.customId,
            });
          }}
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
          labelList={labelList}
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
              "dueAt",
              val ? val.hour(23).minute(59).second(0).valueOf() : null
            );
          }}
          value={values.dueAt ? moment(values.dueAt) : undefined}
          style={{ width: "100%" }}
          disabled={isSubmitting}
        />
      </Form.Item>
    );
  };

  const unassignCollaborator = (
    collaboratorData: ITaskAssignee,
    taskCollaborators: ITaskAssignee[] = []
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
    taskCollaborators: ITaskAssignee[] = []
  ): ITaskAssignee[] => {
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
              "assignees",
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
                "assignees",
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
            formikHelpers.addToArrayField("subTasks", subTask, {}, {});
          }}
          onDeleteSubTask={(index) => {
            formikHelpers.deleteInArrayField("subTasks", index);
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
            {renderNameInput()}
            {renderDescriptionInput(formikProps)}
            {renderParentInput(formikProps)}
            {renderPriority(formikProps)}
            {renderStatus(formikProps)}
            {renderLabels(formikProps)}
            {renderDueDateInput(formikProps)}
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
