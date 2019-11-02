import { Button, DatePicker, Form, Input, List, Select } from "antd";
import { Formik } from "formik";
import moment from "moment";
import React from "react";
import * as yup from "yup";
import { BlockType, ITaskCollaborator } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { textPattern } from "../../models/user/descriptor";
import { IUser } from "../../models/user/user";
import IOperation from "../../redux/operations/operation";
import cast from "../../utils/cast";
import { indexArray } from "../../utils/object";
import CollaboratorThumbnail from "../collaborator/CollaboratorThumbnail";
import FormError from "../form/FormError";
import { applyOperationToFormik, getGlobalError } from "../form/formik-utils";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  FormScrollList,
  StyledForm
} from "../form/FormStyledComponents";
import withModal from "../withModal";
import EditPriority from "./EditPriority";
import { TaskPriority } from "./Priority";
import TaskCollaboratorThumbnail from "./TaskCollaboratorThumbnail";

const validationSchema = yup.object().shape({
  description: yup
    .string()
    .max(blockConstants.maxDescriptionLength)
    .matches(textPattern)
    .required()
});

export interface IEditTaskData {
  // TODO: Should tasks have names and descriptions?
  // name: string;
  customId: string;
  type: BlockType;
  description: string;
  priority: string;
  taskCollaborators: ITaskCollaborator[];
  expectedEndAt: number;
}

interface IEditTaskInternalData extends IEditTaskData {}

export interface IEditTaskProps {
  submitLabel: string;
  defaultAssignedTo: [];
  user: IUser;
  collaborators: IUser[];
  onSubmit: (data: IEditTaskData) => Promise<void>;
  operation?: IOperation;
  data?: IEditTaskInternalData;
}

const defaultSubmitLabel = "Create Task";

class EditTask extends React.Component<IEditTaskProps> {
  public static defaultProps = {
    submitLabel: defaultSubmitLabel,
    defaultAssignedTo: []
  };

  private indexedCollaborators: { [key: string]: IUser };
  private formikRef: React.RefObject<
    Formik<IEditTaskInternalData>
  > = React.createRef();

  constructor(props) {
    super(props);

    this.indexedCollaborators = indexArray(props.collaborators, {
      path: "customId"
    });
  }

  public componentDidMount() {
    applyOperationToFormik(this.props.operation, this.formikRef);
  }

  public componentDidUpdate() {
    applyOperationToFormik(this.props.operation, this.formikRef);
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
        ref={this.formikRef}
        initialValues={cast<IEditTaskInternalData>({
          ...(data || null),

          // TODO: Create a const of defaults
          priority: data ? data.priority : "important",
          taskCollaborators:
            (data ? data.taskCollaborators : defaultAssignedTo) || []
        })}
        validationSchema={validationSchema}
        onSubmit={values => {
          // TODO: Only update forms if fields have changed. Use touched
          values.type = "task";
          onSubmit(values);
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
                        onChange={(value: string) =>
                          setFieldValue("priority", value)
                        }
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
                                collaborator={
                                  this.indexedCollaborators[item.userId]
                                }
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
                            <Select.Option
                              value={index}
                              key={collaborator.customId}
                            >
                              <CollaboratorThumbnail
                                collaborator={collaborator}
                              />
                            </Select.Option>
                          );
                        })}
                      </Select>
                      <Button
                        block
                        onClick={() =>
                          setFieldValue(
                            "taskCollaborators",
                            this.assignCollaborator(
                              user,
                              values.taskCollaborators
                            )
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
                          setFieldValue(
                            "expectedEndAt",
                            value ? value.valueOf() : null
                          )
                        }
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

export default withModal(EditTask, "Task");
