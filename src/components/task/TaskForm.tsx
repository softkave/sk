import { RightCircleTwoTone } from "@ant-design/icons";
import { Button, DatePicker, Form, List, Select, Typography } from "antd";
import { FormikProps } from "formik";
import moment from "moment";
import React from "react";
import { ArrowLeft } from "react-feather";
import {
  IAssigneeInput,
  IBlock,
  IBlockAssignedLabelInput,
  IBlockLabel,
  IBlockStatus,
  IBoardTaskResolution,
  ITaskSprint,
} from "../../models/block/block";
import { IBoard } from "../../models/board/types";
import { ICollaborator } from "../../models/collaborator/types";
import { ISprint } from "../../models/sprint/types";
import { INewTaskInput, ISubTaskInput, ITask } from "../../models/task/types";
import { IUser } from "../../models/user/user";
import { getDateString, indexArray } from "../../utils/utils";
import BlockParentSelection from "../block/BlockParentSelection";
import blockValidationSchemas from "../block/validation";
import BoardStatusResolutionAndLabelsForm, {
  BoardStatusResolutionAndLabelsFormType,
} from "../board/BoardStatusResolutionAndLabelsForm";
import CollaboratorThumbnail from "../collaborator/CollaboratorThumbnail";
import FormError from "../forms/FormError";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import {
  formContentWrapperStyle,
  formInputContentWrapperStyle,
  StyledForm,
} from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import SprintFormInDrawer from "../sprint/SprintFormInDrawer";
import StyledContainer from "../styled/Container";
import InputWithControls from "../utilities/InputWithControls";
import EditPriority from "./EditPriority";
import { TaskPriority } from "./Priority";
import SelectTaskSprint from "./SelectTaskSprint";
import SubTaskFormList from "./SubTaskFormList";
import TaskCollaboratorThumbnail from "./TaskCollaboratorThumbnail";
import TaskLabels from "./TaskLabels";
import TaskStatus from "./TaskStatus";

export type ITaskFormValues = INewTaskInput;
type TaskFormFormikProps = FormikProps<ITaskFormValues>;
export type TaskFormErrors = IFormikFormErrors<ITaskFormValues>;

export interface ITaskFormProps {
  user: IUser;
  collaborators: ICollaborator[];
  statusList: IBlockStatus[];
  resolutionsList: IBoardTaskResolution[];
  labelList: IBlockLabel[];
  labelsMap: { [key: string]: IBlockLabel };
  statusMap: { [key: string]: IBlockStatus };
  resolutionsMap: { [key: string]: IBoardTaskResolution };
  possibleBoardParents: IBoard[];
  value: ITaskFormValues;
  board: IBoard;
  sprints: ISprint[];
  sprintsMap: { [key: string]: ISprint };
  onClose: () => void;
  onSubmit: (values: ITaskFormValues) => void;
  onChangeParent: (parentId: string) => void;
  task?: ITask;
  isSubmitting?: boolean;
  errors?: TaskFormErrors;
}

const StyledContainerAsLink = StyledContainer.withComponent("a");
const TaskForm: React.FC<ITaskFormProps> = (props) => {
  const {
    task,
    isSubmitting,
    possibleBoardParents,
    value,
    collaborators,
    statusList,
    labelList,
    labelsMap,
    resolutionsList,
    user,
    board,
    sprints,
    sprintsMap,
    statusMap,
    resolutionsMap,
    onClose,
    onSubmit,
    errors: externalErrors,
  } = props;

  const [subFormType, setSubFormType] =
    React.useState<BoardStatusResolutionAndLabelsFormType | null>(null);

  const [showSprintForm, setShowSprintForm] = React.useState<boolean>(false);
  const toggleShowSprintForm = React.useCallback(() => {
    setShowSprintForm(!showSprintForm);
  }, [showSprintForm]);

  const closeForm = React.useCallback(() => setSubFormType(null), []);
  const [indexedCollaborators] = React.useState(
    indexArray(props.collaborators, {
      path: "customId",
    })
  );

  const { formik, formikHelpers, formikChangedFieldsHelpers } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      // TODO: show a message on form submit or close the form
      onSubmit,
      initialValues: value,
      validationSchema: !task
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
      });
    }
  }, [statusList, status, formik, user.customId]);

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
      });

      return;
    } else {
      formik.setValues({
        ...formik.values,
        parent: parentId,
        labels: [],
        status: null,
        taskSprint: null,
        taskResolution: null,
      });
    }

    formikChangedFieldsHelpers.pushFields(["parent", "labels", "status"]);
  };

  const renderParentInput = (formikProps: TaskFormFormikProps) => {
    const { touched, errors, values } = formikProps;

    return (
      <Form.Item
        label="Board"
        help={touched.parent && <FormError error={errors.parent} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <BlockParentSelection
          value={values.parent}
          possibleParents={possibleBoardParents}
          onChange={(val) => onChangeParent(val)}
          disabled={isSubmitting}
          placeholder="Select board"
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
        <InputWithControls
          useTextArea
          autoSize={{ minRows: 2, maxRows: 4 }}
          value={values.name}
          onChange={(val) => {
            formik.setFieldValue("name", val);
            formikChangedFieldsHelpers.addField("name");
          }}
          revertChanges={() => {
            formikHelpers.revertChanges("name");
          }}
          autoComplete="off"
          disabled={isSubmitting}
          inputOnly={!task}
          placeholder="Task"
        />
      </Form.Item>
    );
  };

  const renderDescriptionInput = (formikProps: TaskFormFormikProps) => {
    const { touched, values, errors } = formikProps;

    return (
      <Form.Item
        label="Description"
        help={touched.description && <FormError error={errors.description} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <InputWithControls
          useTextArea
          value={values.description}
          onChange={(val) => {
            formik.setFieldValue("description", val);
            formikChangedFieldsHelpers.addField("description");
          }}
          revertChanges={() => {
            formikHelpers.revertChanges("description");
          }}
          autoComplete="off"
          disabled={isSubmitting}
          inputOnly={!task}
          placeholder="Description"
          paragraphProps={{ type: "secondary" }}
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
          onChange={(val: string) => {
            setFieldValue("priority", val);
            formikChangedFieldsHelpers.addField("priority");
          }}
          value={values.priority as TaskPriority}
          disabled={isSubmitting}
        />
      </Form.Item>
    );
  };

  const renderSprintInput = () => {
    if (!board.sprintOptions) {
      return null;
    }

    const input = (
      <SelectTaskSprint
        sprints={sprints}
        sprintsMap={sprintsMap}
        task={formik.values as IBlock}
        disabled={isSubmitting}
        onAddNewSprint={toggleShowSprintForm}
        onChangeSprint={(val) => {
          if (val === BACKLOG) {
            formik.setFieldValue("taskSprint", null);
          } else {
            formik.setFieldValue("taskSprint", {
              sprintId: val,
              assignedAt: getDateString(),
              assignedBy: user.customId,
            } as ITaskSprint);
          }
          formikChangedFieldsHelpers.addField("taskSprint");
        }}
      />
    );

    return (
      <Form.Item
        label="Sprint"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        labelAlign="left"
      >
        {input}
      </Form.Item>
    );
  };

  const onChangeStatus = React.useCallback(
    async (val: string) => {
      if (val === task?.status) {
        formik.setValues({
          ...formik.values,
          status: task.status,
        });
      } else {
        formik.setValues({
          ...formik.values,
          status: val,
        });
      }

      formikChangedFieldsHelpers.pushFields(["status"]);

      return true;
    },
    [formik, formikChangedFieldsHelpers, task]
  );

  const onChangeResolution = React.useCallback(
    (val: string) => {
      formik.setValues({
        ...formik.values,
        taskResolution: val,
      });

      formikChangedFieldsHelpers.pushFields(["taskResolution"]);
    },
    [formik, formikChangedFieldsHelpers]
  );

  const onSelectAddNewStatus = React.useCallback(() => {
    setSubFormType(BoardStatusResolutionAndLabelsFormType.STATUS);
  }, []);

  const onSelectAddNewResolution = React.useCallback(() => {
    setSubFormType(BoardStatusResolutionAndLabelsFormType.RESOLUTIONS);
  }, []);

  const renderStatus = (formikProps: TaskFormFormikProps) => {
    const { values } = formikProps;

    return (
      <Form.Item
        label="Status"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        labelAlign="left"
      >
        <TaskStatus
          noResolutionModal
          statusList={statusList}
          resolutionsList={resolutionsList}
          statusMap={statusMap}
          resolutionsMap={resolutionsMap}
          onChangeStatus={onChangeStatus}
          onChangeResolution={onChangeResolution}
          task={values as IBlock}
          disabled={isSubmitting}
          onSelectAddNewStatus={onSelectAddNewStatus}
          onSelectAddNewResolution={onSelectAddNewResolution}
        />
      </Form.Item>
    );
  };

  const onChangeTaskLabels = React.useCallback(
    (val: IBlockAssignedLabelInput[]) => {
      formik.setFieldValue("labels", val);
      formikChangedFieldsHelpers.addField("labels");
    },
    [formik, formikChangedFieldsHelpers]
  );

  const onSelectAddNewLabel = React.useCallback(() => {
    setSubFormType(BoardStatusResolutionAndLabelsFormType.LABELS);
  }, []);

  // TODO: extract these fields into separate components with React.memo for speed
  const renderLabels = (formikProps: TaskFormFormikProps) => {
    const { values } = formikProps;

    return (
      <Form.Item
        label="Labels"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        labelAlign="left"
      >
        <TaskLabels
          labelList={labelList}
          labelsMap={labelsMap}
          onChange={onChangeTaskLabels}
          labels={values.labels}
          disabled={isSubmitting}
          onSelectAddNewLabel={onSelectAddNewLabel}
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
          // showTime
          format="ddd, MMM DD YYYY"
          placeholder="Due date"
          onChange={(val) => {
            setFieldValue(
              "dueAt",
              val ? val.hour(23).minute(59).second(59).valueOf() : null
            );
            formikChangedFieldsHelpers.addField("dueAt");
          }}
          value={values.dueAt ? moment(values.dueAt) : undefined}
          style={{ width: "100%" }}
          disabled={isSubmitting}
        />
      </Form.Item>
    );
  };

  const unassignCollaborator = (
    collaboratorData: IAssigneeInput,
    assignees: IAssigneeInput[] = []
  ) => {
    const index = assignees.findIndex((next) => {
      return next.userId === collaboratorData.userId;
    });

    if (index !== -1) {
      const updated = [...assignees];
      updated.splice(index, 1);
      return updated;
    }

    return assignees;
  };

  const assignCollaborator = (
    collaborator: ICollaborator,
    assignees: IAssigneeInput[] = []
  ): IAssigneeInput[] => {
    const collaboratorExists = !!assignees.find((next) => {
      return collaborator.customId === next.userId;
    });

    if (!collaboratorExists) {
      return [...assignees, { userId: collaborator.customId }];
    }

    return assignees;
  };

  const renderAssignees = (formikProps: TaskFormFormikProps) => {
    const { values, setFieldValue } = formikProps;

    if (!Array.isArray(values.assignees)) {
      return null;
    }

    if (values.assignees.length === 0) {
      return "Not assigned to anybody yet.";
    }

    return (
      <List
        dataSource={values.assignees}
        renderItem={(item) => (
          <List.Item>
            <TaskCollaboratorThumbnail
              key={item.userId}
              collaborator={indexedCollaborators[item.userId]}
              onUnassign={() => {
                setFieldValue(
                  "assignees",
                  unassignCollaborator(item, values.assignees)
                );

                formikChangedFieldsHelpers.addField("assignees");
              }}
              disabled={isSubmitting}
            />
          </List.Item>
        )}
      />
    );
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
          onChange={(index) => {
            setFieldValue(
              "assignees",
              assignCollaborator(collaborators[Number(index)], values.assignees)
            );
            formikChangedFieldsHelpers.addField("assignees");
          }}
          disabled={isSubmitting}
          optionLabelProp="label"
        >
          {collaborators.map((collaborator, index) => {
            return (
              <Select.Option
                value={index}
                key={collaborator.customId}
                label={collaborator.name}
              >
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
              formikChangedFieldsHelpers.addField("assignees");
            }
          }}
          s={{
            display: "inline-flex",
            alignItems: "center",
            lineHeight: "32px",
            cursor: isSubmitting ? "not-allowed" : undefined,
            color: isSubmitting ? "#f0f0f0" : undefined,
          }}
        >
          {!isSubmitting && <RightCircleTwoTone style={{ fontSize: "16px" }} />}
          <Typography.Text
            style={{
              display: "inline-block",
              marginLeft: isSubmitting ? "0px" : "8px",
              color: "inherit",
            }}
          >
            Assign To Me
          </Typography.Text>
        </StyledContainerAsLink>
        <div style={{ marginBottom: 16 }}>{renderAssignees(formikProps)}</div>
      </Form.Item>
    );
  };

  const onChangeSubTasks = (
    subTasks: ISubTaskInput[],
    formikProps: TaskFormFormikProps
  ) => {
    const { values, setValues } = formikProps;
    const update: ITaskFormValues = { ...values, subTasks };
    setValues(update);
    formikChangedFieldsHelpers.addField("subTasks");
  };

  const onDiscardSubTaskChanges = (index: number) => {
    const taskInitialValue = formik.initialValues || {};
    const initialSubTasks = taskInitialValue.subTasks || [];
    const initialValue = initialSubTasks[index];

    if (initialValue) {
      formik.setFieldValue(`subTasks.[${index}]`, initialValue);
      formikChangedFieldsHelpers.addField("subTasks");
    }
  };

  const renderSubTasks = (formikProps: TaskFormFormikProps) => {
    const { values, touched, errors } = formikProps;

    return (
      <StyledContainer
        s={{
          flexDirection: "column",
          width: "100%",
          marginBottom: "24px",
          borderTop: "1px solid #f0f0f0",
          borderBottom: "1px solid #f0f0f0",
          padding: "8px 0px",
        }}
      >
        <SubTaskFormList
          user={user}
          subTasks={values.subTasks || []}
          errors={errors.subTasks as any}
          touched={touched.subTasks as any}
          onChange={(subTasks) => onChangeSubTasks(subTasks, formikProps)}
          disabled={isSubmitting}
          onAddSubTask={(subTask) => {
            formikHelpers.addToArrayField("subTasks", subTask, {}, {});
            formikChangedFieldsHelpers.addField("subTasks");
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
        <Button
          block
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={!formikChangedFieldsHelpers.hasChanges()}
        >
          {getSubmitLabel()}
        </Button>
      </StyledContainer>
    );
  };

  const { handleSubmit, errors } = formik;
  const globalError = getFormError(errors);

  return (
    <StyledForm onSubmit={handleSubmit}>
      {subFormType && (
        <BoardStatusResolutionAndLabelsForm
          visible
          board={board}
          onClose={closeForm}
          active={subFormType}
        />
      )}
      {showSprintForm && (
        <SprintFormInDrawer
          visible
          board={board}
          onClose={toggleShowSprintForm}
        />
      )}
      <StyledContainer s={formContentWrapperStyle}>
        <StyledContainer s={formInputContentWrapperStyle}>
          <StyledContainer s={{ paddingBottom: "16px" }}>
            <Button
              style={{ cursor: "pointer" }}
              onClick={onClose}
              className="icon-btn"
            >
              <ArrowLeft />
            </Button>
          </StyledContainer>
          {globalError && (
            <Form.Item>
              <FormError error={globalError} />
            </Form.Item>
          )}
          {renderNameInput()}
          {renderDescriptionInput(formik)}
          {renderParentInput(formik)}
          {renderPriority(formik)}
          {renderSprintInput()}
          {renderStatus(formik)}
          {renderLabels(formik)}
          {renderDueDateInput(formik)}
          {renderAssignedToInput(formik)}
          {renderSubTasks(formik)}
        </StyledContainer>
        {renderControls()}
      </StyledContainer>
    </StyledForm>
  );
};

export default React.memo(TaskForm);

const BACKLOG = "Backlog";
