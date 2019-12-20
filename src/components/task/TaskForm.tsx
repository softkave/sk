import styled from "@emotion/styled";
import {
  Button,
  DatePicker,
  Form,
  Icon,
  Input,
  List,
  Radio,
  Select,
  Switch
} from "antd";
import moment from "moment";
import React from "react";
import {
  blockTaskCollaborationTypes,
  BlockType,
  IBlock,
  ITaskCollaborationTypeData,
  ITaskCollaborator
} from "../../models/block/block";
import { isTaskCompleted } from "../../models/block/utils";
import { IUser } from "../../models/user/user";
import cast from "../../utils/cast";
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
import { ISubTaskValues } from "./SubTask";
import SubTaskList from "./SubTaskList";
import TaskCollaboratorThumbnail from "./TaskCollaboratorThumbnail";
import ToggleSwitch from "./ToggleSwitch";

export interface ITaskFormValues {
  // TODO: Should tasks have names and descriptions?
  // name: string;
  customId: string;
  type: BlockType;
  taskCollaborationType: ITaskCollaborationTypeData;
  taskCollaborators: ITaskCollaborator[];
  expectedEndAt: number;
  description?: string;
  parents?: string[];
  subTasks?: ISubTaskValues[];
  priority?: string;
}

export interface ITaskFormProps extends IFormikFormBaseProps<ITaskFormValues> {
  submitLabel: string;
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
      onClose
    } = this.props;

    const globalError = getGlobalError(errors);
    console.log({ values });

    return (
      <StyledForm onSubmit={handleSubmit}>
        <FormBodyContainer>
          <FormBody>
            {globalError && (
              <Form.Item>
                <FormError error={globalError} />
              </Form.Item>
            )}
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
            <Form.Item
              label="Description"
              help={
                touched.description && (
                  <FormError>{errors.description}</FormError>
                )
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
            <Form.Item
              label="Completed"
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              labelAlign="left"
            >
              <StyledContainer s={{ flexDirection: "row-reverse" }}>
                <ToggleSwitch disabled task={values as IBlock} />
                {/* <Switch
                  disabled
                  checked={isTaskCompleted(cast<IBlock>(values), user)}
                /> */}
              </StyledContainer>
            </Form.Item>
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
            <Form.Item
              label="Due Date"
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
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
                  values.expectedEndAt
                    ? moment(values.expectedEndAt)
                    : undefined
                }
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item label="Task Will Be Worked On">
              <Radio.Group
                value={values.taskCollaborationType.collaborationType}
                onChange={e =>
                  setFieldValue("taskCollaborationType", {
                    ...values.taskCollaborationType,
                    collaborationType: e.target.value
                  })
                }
              >
                <StyledRadio
                  key={blockTaskCollaborationTypes.individual}
                  value={blockTaskCollaborationTypes.individual}
                >
                  Individually
                </StyledRadio>
                <StyledRadio
                  key={blockTaskCollaborationTypes.collective}
                  value={blockTaskCollaborationTypes.collective}
                >
                  Together
                </StyledRadio>
              </Radio.Group>
            </Form.Item>
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
            <Form.Item label="Sub Tasks">
              <SubTaskList
                canAddSubTasks
                subTasks={values.subTasks || []}
                onChange={value => setFieldValue("subTasks", value)}
              />
            </Form.Item>
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
                    values.taskCollaborationType.collaborationType
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

const StyledRadio = styled(Radio)({
  display: "block",
  height: "30px",
  lineHeight: "30px"
});
