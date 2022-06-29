import { Button, Divider } from "antd";
import { FormikTouched } from "formik";
import React from "react";
import { Plus } from "react-feather";
import { ISubTask } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { IUser } from "../../models/user/user";
import { getDateString, getNewId } from "../../utils/utils";
import useArray from "../hooks/useArray";

import SubTaskForm, { ISubTaskErrors } from "./SubTaskForm";

export interface ISubTaskFormListProps {
  subTasks: ISubTask[];
  user: IUser;
  onChange: (value: ISubTask[]) => void;
  onAddSubTask: (value: ISubTask) => void;
  onDeleteSubTask: (index: number) => void;
  onDiscardSubTaskChanges: (index: number) => void;
  disabled?: boolean;
  errors?: ISubTaskErrors[];
  touched?: FormikTouched<ISubTask[]>;
}

const SubTaskFormList: React.FC<ISubTaskFormListProps> = (props) => {
  const {
    subTasks: value,
    onChange,
    errors: subTaskErrors,
    disabled,
    user,
    onAddSubTask,
    onDeleteSubTask,
    onDiscardSubTaskChanges,
    touched,
  } = props;
  const editingSubTasksList = useArray<string>();
  const newSubTasksIdList = useArray<string>();
  const subTasks = value || [];
  const errors = subTaskErrors || [];

  const internalOnAdd = () => {
    const subTask: ISubTask = {
      customId: getNewId(),
      description: "",
      createdAt: getDateString(),
      createdBy: user.customId,
    };

    onAddSubTask(subTask);
    editingSubTasksList.add(subTask.customId);
    newSubTasksIdList.add(subTask.customId);
  };

  const internalOnEditSubTask = (index: number, data: Partial<ISubTask>) => {
    const subTask: ISubTask = {
      ...subTasks[index],
      ...data,
    };
    const newSubTasks = [...subTasks];
    newSubTasks[index] = subTask;
    onChange(newSubTasks);
  };

  const onToggleSubTask = (index: number) => {
    const subTask = subTasks[index];
    const isCompleted = !!subTask.completedBy;

    internalOnEditSubTask(index, {
      completedBy: isCompleted ? undefined : user.customId,
    });
  };

  const internalOnDeleteSubTask = (index: number) => {
    const subTask = subTasks[index];
    onDeleteSubTask(index);
    editingSubTasksList.remove(subTask.customId);
  };

  const internalOnDiscardSubTaskChanges = (index: number) => {
    const subTask = subTasks[index];
    editingSubTasksList.remove(subTask.customId);
    onDiscardSubTaskChanges(index);
  };

  const internalOnCommitSubTaskChanges = (index: number) => {
    const subTask = subTasks[index];
    editingSubTasksList.remove(subTask.customId);
  };

  const renderSubTask = (
    subTask: ISubTask,
    error: ISubTaskErrors = {},
    subTaskTouched: FormikTouched<ISubTask> = {},
    index: number
  ) => {
    return (
      <SubTaskForm
        isEditing={editingSubTasksList.exists(subTask.customId)}
        errorMessage={
          subTaskTouched.description ? error.description : undefined
        }
        onCancelEdit={() => internalOnDiscardSubTaskChanges(index)}
        onChange={(update) => internalOnEditSubTask(index, update)}
        onDelete={() => internalOnDeleteSubTask(index)}
        onToggle={() => onToggleSubTask(index)}
        onEdit={() => {
          editingSubTasksList.add(subTask.customId);
        }}
        onSave={() => internalOnCommitSubTaskChanges(index)}
        subTask={subTask}
        isNew={newSubTasksIdList.exists(subTask.customId)}
        disabled={disabled}
      />
    );
  };

  const renderSubTaskList = () => {
    const tchd = touched || [];
    return (
      <React.Fragment>
        {subTasks.map((subTask, index) => (
          <React.Fragment key={subTask.customId}>
            {renderSubTask(subTask, errors[index], tchd[index], index)}
            {index < subTasks.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  };

  const renderLabel = () => {
    return (
      <div
        style={{
          width: "100%",
          lineHeight: "40px",
          fontWeight: 500,
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          Sub-tasks ({subTasks.length} of {blockConstants.maxSubTasks})
        </div>
        <Button
          disabled={disabled || subTasks.length >= blockConstants.maxSubTasks}
          onClick={internalOnAdd}
          htmlType="button"
          className="icon-btn"
        >
          <Plus />
        </Button>
      </div>
    );
  };

  return (
    <div>
      {renderLabel()}
      {renderSubTaskList()}
    </div>
  );
};

export default SubTaskFormList;
