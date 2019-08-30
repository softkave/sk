import { Button, DatePicker, Form, Input, List, Select } from "antd";
import { Formik } from "formik";
import moment from "moment";
import React from "react";
import * as yup from "yup";

import { IBlock } from "../../../models/block/block";
import { blockConstants } from "../../../models/block/constants";
import { textPattern } from "../../../models/user/descriptor";
import { IUser } from "../../../models/user/user";
import { indexArray } from "../../../utils/object";
import CollaboratorThumbnail from "../../collaborator/Thumnail";
import FormError from "../../FormError";
import { getGlobalError, submitHandler } from "../../formik-utils";
import modalWrap from "../../modalWrap.jsx";
import EditPriority from "./EditPriority";
import { TaskPriority } from "./Priority";
import TaskCollaboratorThumbnail from "./TaskCollaboratorThumbnail";

const validationSchema = yup.object().shape({
  description: yup
    .string()
    .max(blockConstants.maxDescriptionLength)
    .matches(textPattern)
});

interface ITaskCollaborator {
  userId: string;
  assignedAt: number;
  assignedBy: string;
  completedAt?: number;
}

interface IEditTaskValues {
  // name: string;
  description: string;
  priority: string;
  taskCollaborators: ITaskCollaborator[];
  expectedEndAt: number;
}

// TODO: Input appropriate types
export interface IEditTaskProps {
  data: IEditTaskValues;
  submitLabel: string;
  defaultAssignedTo: [];
  user: IUser;
  collaborators: IUser[];
  onSubmit: (data: IBlock) => Promise<void>;
}

class EditTask extends React.Component<IEditTaskProps> {
  public static defaultProps = {
    data: {},
    submitLabel: "Create Task",
    defaultAssignedTo: []
  };

  // TODO: Input appropriate types
  private indexedCollaborators: { [key: string]: IUser };

  constructor(props) {
    super(props);

    this.indexedCollaborators = indexArray(props.collaborators, {
      path: "customId"
    });
  }

  public render() {
    const {
      data,
      collaborators,
      defaultAssignedTo,
      user,
      submitLabel,
      onSubmit
    } = this.props;

    return (
      <Formik
        initialValues={{
          ...data,
          taskCollaborators: data.taskCollaborators || defaultAssignedTo || []
        }}
        validationSchema={validationSchema}
        onSubmit={(values, props) => {
          (values as any).type = "task";
          submitHandler(onSubmit, values, props);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue
        }) => {
          const globalError = getGlobalError(errors);

          return (
            <form onSubmit={handleSubmit}>
              {/* <Form.Item
                label="Task Name"
                help={<FormError>{errors.name}</FormError>}
              >
                <Input
                  autoComplete="off"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                />
              </Form.Item> */}
              {globalError && (
                <Form.Item>
                  <FormError error={globalError} />
                </Form.Item>
              )}
              <Form.Item
                label="Description"
                help={<FormError>{errors.description}</FormError>}
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
                              this.unassignCollaborator(
                                item,
                                values.taskCollaborators
                              )
                            )
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Select
                  placeholder="Assign Collaborator"
                  value={undefined}
                  onChange={value =>
                    setFieldValue(
                      "taskCollaborators",
                      this.assignCollaborator(value, values.taskCollaborators)
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
                  onChange={value =>
                    setFieldValue("expectedEndAt", value.valueOf())
                  }
                  value={
                    values.expectedEndAt
                      ? moment(values.expectedEndAt)
                      : undefined
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  {submitLabel}
                </Button>
              </Form.Item>
            </form>
          );
        }}
      </Formik>
    );
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

export default modalWrap(EditTask, "Task");
