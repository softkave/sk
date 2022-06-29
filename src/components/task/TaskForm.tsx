import { RightCircleTwoTone } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, DatePicker, Form, List, Select, Typography } from "antd";
import { FormikProps } from "formik";
import { first } from "lodash";
import moment from "moment";
import React from "react";
import { ArrowLeft } from "react-feather";
import {
  IBlockAssignedLabel,
  IBlockLabel,
  IBlockStatus,
  IBoardTaskResolution,
  ISubTask,
  ITaskAssignee,
} from "../../models/block/block";
import { IBoard } from "../../models/board/types";
import { ICollaborator } from "../../models/collaborator/types";
import { ISprint } from "../../models/sprint/types";
import { ITask, ITaskFormValues } from "../../models/task/types";
import { assignSprint, assignStatus } from "../../models/task/utils";
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
  formClasses,
  formClassname,
  formContentWrapperStyle,
  formInputContentWrapperStyle,
} from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import SprintFormInDrawer from "../sprint/SprintFormInDrawer";
import InputWithControls from "../utilities/InputWithControls";
import EditPriority from "./EditPriority";
import { TaskPriority } from "./Priority";
import SelectTaskSprint from "./SelectTaskSprint";
import SubTaskFormList from "./SubTaskFormList";
import TaskCollaboratorThumbnail from "./TaskCollaboratorThumbnail";
import TaskLabelListForm from "./TaskLabelListForm";
import TaskStatus from "./TaskStatus";

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
    onChangeParent: pushParentChangeToContainer,
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

  const { setValues, setFieldValue, handleSubmit, values, touched, errors } =
    formik;
  const status = values.status;
  const status0 = first(statusList);
  React.useEffect(() => {
    if (!status && status0) {
      setValues(assignStatus(values, status0.customId, user.customId, task));
    }
  }, [status0, status, values, user.customId, task, setValues]);

  const onChangeParent = React.useCallback(
    (parentId: string) => {
      if (parentId === values.parent) {
        return;
      }

      if (parentId === task?.parent) {
        setValues({
          ...values,
          parent: parentId,
          labels: task.labels,
          status: task.status,
        });

        return;
      } else {
        setValues({
          ...values,
          parent: parentId,
          labels: [],
          status: null,
          taskSprint: null,
          taskResolution: null,
        });
      }

      pushParentChangeToContainer(parentId);
      formikChangedFieldsHelpers.pushFields(["parent", "labels", "status"]);
    },
    [
      task,
      values,
      setValues,
      formikChangedFieldsHelpers,
      pushParentChangeToContainer,
    ]
  );

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
          onChange={onChangeParent}
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

  const renderDescriptionInput = () => {
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
        className={formClasses.compactFormItem}
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

  const onChangeSprint = React.useCallback(
    (sprintId: string) => {
      setValues(assignSprint(values, sprintId, user.customId, task));
      formikChangedFieldsHelpers.pushFields(["taskSprint"]);
    },
    [values, setValues, user, task, formikChangedFieldsHelpers]
  );

  const renderSprintInput = () => {
    if (!board.sprintOptions) {
      return null;
    }

    const input = (
      <SelectTaskSprint
        sprints={sprints}
        sprintsMap={sprintsMap}
        task={formik.values as ITask}
        disabled={isSubmitting}
        onAddNewSprint={toggleShowSprintForm}
        onChangeSprint={onChangeSprint}
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
    async (statusId: string) => {
      setValues(assignStatus(values, statusId, user.customId, task));
      formikChangedFieldsHelpers.pushFields(["status"]);
      return true;
    },
    [user.customId, values, setValues, formikChangedFieldsHelpers, task]
  );

  const onChangeResolution = React.useCallback(
    (resolutionId: string) => {
      setValues({
        ...values,
        taskResolution: resolutionId,
      });

      formikChangedFieldsHelpers.pushFields(["taskResolution"]);
    },
    [values, setValues, formikChangedFieldsHelpers]
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
        className={formClasses.compactFormItem}
      >
        <TaskStatus
          noResolutionModal
          statusList={statusList}
          resolutionsList={resolutionsList}
          statusMap={statusMap}
          resolutionsMap={resolutionsMap}
          onChangeStatus={onChangeStatus}
          onChangeResolution={onChangeResolution}
          task={values as ITask}
          disabled={isSubmitting}
          onSelectAddNewStatus={onSelectAddNewStatus}
          onSelectAddNewResolution={onSelectAddNewResolution}
        />
      </Form.Item>
    );
  };

  const onChangeTaskLabels = React.useCallback(
    (inputLabels: IBlockAssignedLabel[]) => {
      setFieldValue("labels", inputLabels);
      formikChangedFieldsHelpers.addField("labels");
    },
    [setFieldValue, formikChangedFieldsHelpers]
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
        <TaskLabelListForm
          userId={user.customId}
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
    collaboratorData: ITaskAssignee,
    assignees: ITaskAssignee[] = []
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
    assignees: ITaskAssignee[] = []
  ): ITaskAssignee[] => {
    const collaboratorExists = !!assignees.find((next) => {
      return collaborator.customId === next.userId;
    });

    if (!collaboratorExists) {
      return [
        ...assignees,
        {
          userId: collaborator.customId,
          assignedAt: getDateString(),
          assignedBy: user.customId,
        },
      ];
    }

    return assignees;
  };

  const renderAssignees = () => {
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
        <Button
          type="link"
          onClick={() => {
            if (!isSubmitting) {
              setFieldValue(
                "assignees",
                assignCollaborator(user, values.assignees)
              );
              formikChangedFieldsHelpers.addField("assignees");
            }
          }}
          className={css({
            display: "inline-flex",
            alignItems: "center",
            lineHeight: "32px",
            cursor: isSubmitting ? "not-allowed" : undefined,
            color: isSubmitting ? "#f0f0f0" : undefined,
            padding: "0px !important",
          })}
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
        </Button>
        <div style={{ marginBottom: 16 }}>{renderAssignees()}</div>
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
      <div
        className={css({
          flexDirection: "column",
          width: "100%",
          marginBottom: "24px",
          borderTop: "1px solid #f0f0f0",
          borderBottom: "1px solid #f0f0f0",
          padding: "8px 0px",
        })}
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
      </div>
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
      <div>
        <Button
          block
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={!formikChangedFieldsHelpers.hasChanges()}
        >
          {getSubmitLabel()}
        </Button>
      </div>
    );
  };

  const globalError = getFormError(errors);
  return (
    <form onSubmit={handleSubmit} className={formClassname}>
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
      <div style={formContentWrapperStyle}>
        <div style={formInputContentWrapperStyle}>
          <div style={{ paddingBottom: "16px" }}>
            <Button
              style={{ cursor: "pointer" }}
              onClick={onClose}
              className="icon-btn"
            >
              <ArrowLeft />
            </Button>
          </div>
          {globalError && (
            <Form.Item>
              <FormError error={globalError} />
            </Form.Item>
          )}
          {renderNameInput()}
          {renderDescriptionInput()}
          {renderParentInput(formik)}
          {renderPriority(formik)}
          {renderSprintInput()}
          {renderStatus(formik)}
          {renderLabels(formik)}
          {renderDueDateInput(formik)}
          {renderAssignedToInput(formik)}
          {renderSubTasks(formik)}
        </div>
        {renderControls()}
      </div>
    </form>
  );
};

export default React.memo(TaskForm);
