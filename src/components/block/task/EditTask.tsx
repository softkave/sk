import { Button, DatePicker, Form, Input, List, Select, Spin } from "antd";
import { Formik } from "formik";
import moment from "moment";
import React from "react";

import { blockErrorFields } from "../../../models/block/blockErrorMessages";
import { taskDescriptor as blockDescriptor } from "../../../models/block/descriptor";
import { serverErrorFields } from "../../../models/serverErrorMessages";
import { indexArray } from "../../../utils/object";
import CollaboratorThumbnail from "../../collaborator/Thumnail";
import { constructSubmitHandler } from "../../form-utils.js";
import FormError from "../../FormError.jsx";
import modalWrap from "../../modalWrap.jsx";
import EditPriority from "./EditPriority.jsx";
import TaskCollaboratorThumbnail from "./TaskCollaboratorThumbnail";

export interface IEditTaskProps {
  data: any;
  submitLabel: string;
  defaultAssignedTo: [];
  user: any;
  collaborators: any;
  onSubmit: any;
}

class EditTask extends React.Component<IEditTaskProps> {
  public static defaultProps = {
    data: {},
    submitLabel: "Create Task"
  };

  public indexedCollaborators: any[];

  constructor(props) {
    super(props);

    this.indexedCollaborators = indexArray(props.collaborators, {
      path: "customId"
    });
  }

  public getSubmitHandler = () => {
    const { onSubmit } = this.props;

    return constructSubmitHandler({
      submitCallback: onSubmit,
      process: data => {
        data.type = "task";
        return { values: data, hasError: false };
      },
      beforeProcess: () => this.setState({ isLoading: true, error: null }),
      afterErrorProcess: indexedErrors => {
        if (Array.isArray(indexedErrors.error) && indexedErrors.error[0]) {
          this.setState({
            error: indexedErrors.error[0].message,
            isLoading: false
          });
        }
      },
      transformErrorMap: [
        {
          field: blockErrorFields.orgExists,
          toField: "name"
        },
        {
          field: serverErrorFields.serverError,
          toField: "error"
        }
      ]
    });
  };

  public assignCollaborator = (collaborator, taskCollaborators) => {
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
          completedAt: 0,
          assignedBy: user.customId
        }
      ];
    }

    return taskCollaborators;
  };

  public unassignCollaborator = (taskC, taskCollaborators) => {
    const index = taskCollaborators.findIndex(next => {
      return next.userId === taskC.userId;
    });

    if (index !== -1) {
      const updated = [...taskCollaborators];
      updated.splice(index, 1);
      return updated;
    }

    return taskCollaborators;
  };

  public render() {
    const {
      data,
      collaborators,
      defaultAssignedTo,
      user,
      submitLabel
    } = this.props;

    return (
      <Formik initialValues={null} onSubmit={null} validate={null}>
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
          return (
            <form onSubmit={handleSubmit}>
              <Form.Item label="Organization Name">
                <Input
                  autoComplete="off"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                />
              </Form.Item>
              <Form.Item label="Description">
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
                  value={values.priority}
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
                  disabled={isSubmitting}
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
}

export default modalWrap(EditTask, "Task");
