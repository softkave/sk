import styled from "@emotion/styled";
import {
  Button,
  DatePicker,
  Form,
  Icon,
  Input,
  List,
  Select,
  Switch
} from "antd";
import moment from "moment";
import React from "react";
import {
  BlockType,
  IBlock,
  ISubTask,
  ITaskCollaborationData,
  ITaskCollaborator
} from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { indexArray } from "../../utils/object";
import BlockParentSelection from "../block/BlockParentSelection";
import CollaboratorThumbnail from "../collaborator/CollaboratorThumbnail";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormBaseProps } from "../form/formik-utils";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  StyledForm
} from "../form/FormStyledComponents";
import StyledButton from "../styled/Button";
import StyledContainer from "../styled/Container";
import EditPriority from "./EditPriority";
import { TaskPriority } from "./Priority";
import SubTaskList from "./SubTaskList";
import TaskCollaboratorThumbnail from "./TaskCollaboratorThumbnail";

export interface ITaskFormValues {
  // TODO: Should tasks have names and descriptions?
  // name: string;
  customId: string;
  type: BlockType;
  taskCollaborationData: ITaskCollaborationData;
  taskCollaborators: ITaskCollaborator[];
  expectedEndAt: number;
  description?: string;
  parents?: string[];
  subTasks?: ISubTask[];
  priority?: string;
}

export interface ITaskFormProps extends IFormikFormBaseProps<ITaskFormValues> {
  submitLabel?: React.ReactNode;
  user: IUser;
  collaborators: IUser[];
  parents: IBlock[];
  onClose: () => void;
}

const defaultSubmitLabel = "Create Task";
const StyledContainerAsLink = StyledContainer.withComponent("a");

export default class TaskForm extends React.Component<ITaskFormProps> {
  public static defaultProps = {
    submitLabel: defaultSubmitLabel,
    defaultAssignedTo: []
  };

  private indexedCollaborators: { [key: string]: IUser };

  constructor(props) {
    super(props);

    this.indexedCollaborators = indexArray(props.collaborators, {
      path: "customId"
    });
  }

  public render() {
    const {
      collaborators,
      user,
      submitLabel,
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      setFieldValue,
      parents,
      onClose,
      setValues
    } = this.props;

    const globalError = getGlobalError(errors);
    const renderParentInput = () => (
      <Form.Item
        label="Parent"
        help={touched.parents && <FormError>{errors.parents}</FormError>}
      >
        <BlockParentSelection
          value={values.parents}
          parents={parents}
          onChange={parentIDs => setFieldValue("parents", parentIDs)}
        />
      </Form.Item>
    );

    const renderDescription = () => (
      <Form.Item
        label="Description"
        help={
          touched.description && <FormError>{errors.description}</FormError>
        }
      >
        <Input.TextArea
          autosize={{ minRows: 2, maxRows: 6 }}
          autoComplete="off"
          name="description"
          placeholder="Description"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.description}
        />
      </Form.Item>
    );

    const onChangeToggleSwitch = () => {
      const isCompleted = !!values.taskCollaborationData.completedAt;
      const now = Date.now();
      const update: ITaskFormValues = {
        ...values,
        taskCollaborationData: {
          ...values.taskCollaborationData,
          completedAt: isCompleted ? null : now,
          completedBy: isCompleted ? null : user.customId
        }
      };
      const subTasks = update.subTasks;

      if (Array.isArray(subTasks) && subTasks.length > 0) {
        const newSubTasks = subTasks.map(subTask => ({
          ...subTask,
          completedAt: isCompleted ? null : now,
          completedBy: isCompleted ? null : user.customId
        }));

        update.subTasks = newSubTasks;
      }

      setValues(update);
    };

    const renderToggleSwitch = () => (
      <Form.Item
        label="Completed"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        labelAlign="left"
        style={{ textAlign: "right" }}
      >
        <Switch
          checked={!!values.taskCollaborationData.completedAt}
          onChange={onChangeToggleSwitch}
        />
      </Form.Item>
    );

    const renderPriority = () => (
      <Form.Item
        label="Priority"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        labelAlign="left"
      >
        <StyledContainer s={{ flexDirection: "row-reverse" }}>
          <EditPriority
            onChange={(value: string) => setFieldValue("priority", value)}
            value={values.priority as TaskPriority}
          />
        </StyledContainer>
      </Form.Item>
    );

    const renderDueDateInput = () => (
      <Form.Item
        label="Due Date"
        labelCol={{ span: 12, xs: { span: 24 } }}
        wrapperCol={{ span: 12, xs: { span: 24 } }}
        labelAlign="left"
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="Due date"
          onChange={value => {
            setFieldValue(
              "expectedEndAt",
              value
                ? value
                    .hour(23)
                    .minute(59)
                    .second(0)
                    .valueOf()
                : null
            );
          }}
          value={
            values.expectedEndAt ? moment(values.expectedEndAt) : undefined
          }
          style={{ width: "100%" }}
        />
      </Form.Item>
    );

    const renderAssignedToInput = () => (
      <Form.Item label="Assigned To">
        <Select
          placeholder="Assign collaborator"
          value={undefined}
          onChange={index =>
            setFieldValue(
              "taskCollaborators",
              this.assignCollaborator(
                collaborators[Number(index)],
                values.taskCollaborators
              )
            )
          }
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
          onClick={() =>
            setFieldValue(
              "taskCollaborators",
              this.assignCollaborator(user, values.taskCollaborators)
            )
          }
          s={{ display: "block", lineHeight: "32px" }}
        >
          <Icon type="right-circle" theme="twoTone" /> Assign To Me
        </StyledContainerAsLink>
        <StyledTaskCollaboaratorsContainer>
          {this.renderTaskCollaborators()}
        </StyledTaskCollaboaratorsContainer>
      </Form.Item>
    );

    const onChangeSubTasks = (subTasks: ISubTask[]) => {
      const update: ITaskFormValues = { ...values, subTasks };
      const now = Date.now();

      if (Array.isArray(subTasks) && subTasks.length > 0) {
        const areSubTasksCompleted = !!!subTasks.find(
          subTask => !!!subTask.completedAt
        );

        if (
          areSubTasksCompleted !== !!values.taskCollaborationData.completedAt
        ) {
          update.taskCollaborationData = {
            ...update.taskCollaborationData,
            completedAt: areSubTasksCompleted ? now : null,
            completedBy: areSubTasksCompleted ? user.customId : null
          };
        }
      }

      setValues(update);
    };

    const renderSubTasks = () => (
      <Form.Item label="Sub Tasks">
        <SubTaskList
          subTasks={values.subTasks || []}
          errors={touched.subTasks && (errors.subTasks as any)}
          onChange={onChangeSubTasks}
        />
      </Form.Item>
    );

    return (
      <StyledForm onSubmit={handleSubmit}>
        <FormBodyContainer>
          <FormBody>
            {globalError && (
              <Form.Item>
                <FormError error={globalError} />
              </Form.Item>
            )}
            {renderParentInput()}
            {renderDescription()}
            {renderToggleSwitch()}
            {renderPriority()}
            {renderDueDateInput()}
            {/* {renderCollaborationTypeInput()} */}
            {renderAssignedToInput()}
            {renderSubTasks()}
          </FormBody>
          <FormControls>
            <StyledButton
              block
              type="danger"
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
          </FormControls>
        </FormBodyContainer>
      </StyledForm>
    );
  }

  private renderTaskCollaborators() {
    const { values, setFieldValue } = this.props;

    if (Array.isArray(values.taskCollaborators)) {
      if (values.taskCollaborators.length === 0) {
        return "This task is not yet assigned";
      }

      return (
        <List
          dataSource={values.taskCollaborators}
          renderItem={item => {
            return (
              <List.Item>
                <TaskCollaboratorThumbnail
                  key={item.userId}
                  collaborationType={
                    values.taskCollaborationData.collaborationType
                  }
                  collaborator={this.indexedCollaborators[item.userId]}
                  taskCollaborator={item}
                  onUnassign={() =>
                    setFieldValue(
                      "taskCollaborators",
                      this.unassignCollaborator(item, values.taskCollaborators)
                    )
                  }
                />
              </List.Item>
            );
          }}
        />
      );
    }

    return null;
  }

  private assignCollaborator = (
    collaborator: IUser,
    taskCollaborators: ITaskCollaborator[]
  ): ITaskCollaborator[] => {
    const { user } = this.props;
    const collaboratorExists = !!taskCollaborators.find(next => {
      return collaborator.customId === next.userId;
    });

    if (!collaboratorExists) {
      return [
        ...taskCollaborators,
        {
          userId: collaborator.customId,
          assignedAt: Date.now(),
          assignedBy: user.customId
        }
      ];
    }

    return taskCollaborators;
  };

  private unassignCollaborator = (
    collaboratorData: ITaskCollaborator,
    taskCollaborators: ITaskCollaborator[]
  ) => {
    const index = taskCollaborators.findIndex(next => {
      return next.userId === collaboratorData.userId;
    });

    if (index !== -1) {
      const updated = [...taskCollaborators];
      updated.splice(index, 1);
      return updated;
    }

    return taskCollaborators;
  };
}

const StyledTaskCollaboaratorsContainer = styled.div({
  marginBottom: 16
});
