import { Button, DatePicker, Form, Input, List, Select } from "antd";
import moment from "moment";
import React from "react";
import { BlockType, ITaskCollaborator } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { indexArray } from "../../utils/object";
import CollaboratorThumbnail from "../collaborator/CollaboratorThumbnail";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormBaseProps } from "../form/formik-utils";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  FormScrollList,
  StyledForm
} from "../form/FormStyledComponents";
import EditPriority from "./EditPriority";
import { TaskPriority } from "./Priority";
import TaskCollaboratorThumbnail from "./TaskCollaboratorThumbnail";

export interface ITaskFormValues {
  // TODO: Should tasks have names and descriptions?
  // name: string;
  customId: string;
  type: BlockType;
  description: string;
  priority: string;
  taskCollaborators: ITaskCollaborator[];
  expectedEndAt: number;
}

export interface ITaskFormProps extends IFormikFormBaseProps<ITaskFormValues> {
  submitLabel: string;
  user: IUser;
  collaborators: IUser[];
}

const defaultSubmitLabel = "Create Task";

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
      setFieldValue
    } = this.props;

    const globalError = getGlobalError(errors);

    return (
      <StyledForm onSubmit={handleSubmit}>
        <FormBodyContainer>
          <FormScrollList>
            <FormBody>
              {globalError && (
                <Form.Item>
                  <FormError error={globalError} />
                </Form.Item>
              )}
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
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                />
              </Form.Item>
              <Form.Item label="Priority">
                <EditPriority
                  onChange={(value: string) => setFieldValue("priority", value)}
                  value={values.priority as TaskPriority}
                />
              </Form.Item>
              <Form.Item label="Assigned To">
                {this.renderTaskCollaborators()}
              </Form.Item>
              <Form.Item>
                <Select
                  placeholder="Assign Collaborator"
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
                <Button
                  block
                  onClick={() =>
                    setFieldValue(
                      "taskCollaborators",
                      this.assignCollaborator(user, values.taskCollaborators)
                    )
                  }
                >
                  Assign To Me
                </Button>
              </Form.Item>
              <Form.Item label="Complete At">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="Complete At"
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
                />
              </Form.Item>
            </FormBody>
          </FormScrollList>
          <FormControls>
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

    if (
      Array.isArray(values.taskCollaborators) &&
      values.taskCollaborators.length > 0
    ) {
      return (
        <List
          dataSource={values.taskCollaborators}
          renderItem={item => {
            return (
              <List.Item>
                <TaskCollaboratorThumbnail
                  key={item.userId}
                  collaborator={this.indexedCollaborators[item.userId]}
                  taskCollaborator={item}
                  onToggle={null}
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
