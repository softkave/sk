import { Divider } from "antd";
import React from "react";
import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import { textPattern } from "../../models/user/descriptor";
import StyledFlatButton from "../styled/FlatButton";
import SubTask, { ISubTaskValues } from "./SubTask";
import SubTaskForm from "./SubTaskForm";

export interface ISubTaskListProps {
  subTasks: ISubTaskValues[];
  onChange: (value: ISubTaskValues[]) => void;
  canAddSubTasks?: boolean;
}

interface ISubTaskState {
  subTask: ISubTaskValues;
  errorMessage?: string | null;
}

const descriptionValidationSchema = yup
  .string()
  .max(blockConstants.maxDescriptionLength)
  .matches(textPattern)
  .required();

const SubTaskList: React.SFC<ISubTaskListProps> = props => {
  const { subTasks: value, onChange, canAddSubTasks } = props;
  const subTasks = value || [];

  const [subTasksBeingEdited, setSubTasksBeingEdited] = React.useState<{
    [key: string]: ISubTaskState;
  }>({});

  const isSubTaskBeingEdited = (index: string | number) => {
    return !!subTasksBeingEdited[index];
  };

  const removeSubTaskFromSubTasksBeingEdited = index => {
    if (isSubTaskBeingEdited(index)) {
      const newSubTasksBeingEdited = { ...subTasksBeingEdited };
      delete newSubTasksBeingEdited[index];
      setSubTasksBeingEdited(newSubTasksBeingEdited);
    }
  };

  const onDeleteSubTask = (index: number) => {
    const newSubTasks = [...subTasks];
    newSubTasks.splice(index, 1);
    removeSubTaskFromSubTasksBeingEdited(index);
    onChange(newSubTasks);
  };

  const onCommitSubTaskUpdate = (index: number) => {
    const newSubTasks = [...subTasks];
    const subTask = subTasksBeingEdited[index];

    if (!subTask.errorMessage) {
      if (Number(index) >= newSubTasks.length) {
        newSubTasks.push(subTask.subTask);
      } else {
        newSubTasks[index] = subTask.subTask;
      }

      removeSubTaskFromSubTasksBeingEdited(index);
      onChange(newSubTasks);
    }
  };

  const onBeginEditSubTask = (index: string | number) => {
    const subTask = subTasks[index];

    if (subTask) {
      const newSubTasksBeingEdited = { ...subTasksBeingEdited };
      newSubTasksBeingEdited[index] = {
        subTask,
        errorMessage: undefined
      };

      setSubTasksBeingEdited(newSubTasksBeingEdited);
    }
  };

  const onUpdateSubTask = (index: string | number, update: ISubTaskValues) => {
    if (isSubTaskBeingEdited(index)) {
      const newSubTasksBeingEdited = { ...subTasksBeingEdited };
      const subTaskState = { ...newSubTasksBeingEdited[index] };
      const subTask = { ...subTaskState.subTask, ...update };
      const error = descriptionValidationSchema.validateSync(
        subTask.description
      );

      if (error) {
        subTaskState.errorMessage = error;
      }

      subTaskState.subTask = subTask;
      newSubTasksBeingEdited[index] = subTaskState;
      setSubTasksBeingEdited(newSubTasksBeingEdited);
    }
  };

  const onAddSubTask = () => {
    const subTasksLength = subTasks.length;
    const newSubTasksBeingEdited = { ...subTasksBeingEdited };
    newSubTasksBeingEdited[subTasksLength] = {
      errorMessage: undefined,
      subTask: { description: "" }
    };

    setSubTasksBeingEdited(newSubTasksBeingEdited);
  };

  const renderSubTask = (subTask: ISubTaskValues, index: number) => {
    const isEditing = isSubTaskBeingEdited(index);

    if (isEditing) {
      const subTaskState = subTasksBeingEdited[index];

      return (
        <SubTaskForm
          errorMessage={subTaskState.errorMessage}
          onCancelEdit={() => removeSubTaskFromSubTasksBeingEdited(index)}
          onChange={update => onUpdateSubTask(index, update)}
          onCommitUpdates={() => onCommitSubTaskUpdate(index)}
          onDelete={() => onDeleteSubTask(index)}
          subTask={subTaskState.subTask}
        />
      );
    } else {
      return (
        <SubTask
          onDelete={() => onDeleteSubTask(index)}
          onEdit={() => onBeginEditSubTask(index)}
          subTask={subTask}
        />
      );
    }
  };

  return (
    <div>
      {subTasks.map((subTask, index) => (
        <React.Fragment>
          {renderSubTask(subTask, index)}
          <Divider />
        </React.Fragment>
      ))}
      {canAddSubTasks && (
        <StyledFlatButton icon="plus" onClick={() => onAddSubTask()}>
          Add sub-task
        </StyledFlatButton>
      )}
    </div>
  );
};

export default SubTaskList;
