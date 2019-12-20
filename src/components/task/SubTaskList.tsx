import styled from "@emotion/styled";
import { Button, Divider, Icon } from "antd";
import { forIn } from "lodash";
import React from "react";
import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import { textPattern } from "../../models/user/descriptor";
import { newId } from "../../utils/utils";
import StyledContainer from "../styled/Container";
import SubTask, { ISubTaskValues } from "./SubTask";
import SubTaskForm from "./SubTaskForm";

const StyledContainerAsLink = StyledContainer.withComponent("a");

export interface ISubTaskListProps {
  subTasks: ISubTaskValues[];
  onChange: (value: ISubTaskValues[]) => void;
  canAddSubTasks?: boolean;
}

interface ISubTaskState {
  subTask: ISubTaskValues;
  errorMessage?: string | null;
  index: string | number;
}

const descriptionValidationSchema = yup
  .string()
  .required()
  .max(blockConstants.maxDescriptionLength)
  .matches(textPattern);

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

  const onDeleteSubTask = (index: string | number) => {
    const newSubTasks = [...subTasks];
    newSubTasks.splice(Number(index), 1);
    removeSubTaskFromSubTasksBeingEdited(index);
    onChange(newSubTasks);
  };

  const validateSubTask = (subTask: ISubTaskValues) => {
    try {
      descriptionValidationSchema.validateSync(subTask.description);
    } catch (error) {
      return error;
    }
  };

  const onBeginEditSubTask = (index: string | number) => {
    const subTask = subTasks[index];

    if (subTask) {
      const newSubTasksBeingEdited = { ...subTasksBeingEdited };
      newSubTasksBeingEdited[index] = {
        subTask,
        index,
        errorMessage: undefined
      };

      setSubTasksBeingEdited(newSubTasksBeingEdited);
    }
  };

  const onUpdateSubTask = (index: string | number, update: ISubTaskValues) => {
    if (isSubTaskBeingEdited(index)) {
      const newSubTasksBeingEdited = { ...subTasksBeingEdited };
      const oldSubTaskState = { ...newSubTasksBeingEdited[index] };
      const subTask = { ...oldSubTaskState.subTask, ...update };
      const error = validateSubTask(subTask);
      const newSubTaskState = {
        ...oldSubTaskState,
        subTask,
        errorMessage: error
      };

      newSubTasksBeingEdited[index] = newSubTaskState;
      setSubTasksBeingEdited(newSubTasksBeingEdited);
    }
  };

  const onAddSubTask = () => {
    const subTasksLength = subTasks.length;
    const newSubTasksBeingEdited = { ...subTasksBeingEdited };
    let newSubTaskIndex = subTasksLength;

    while (isSubTaskBeingEdited(newSubTaskIndex)) {
      newSubTaskIndex += 1;
    }

    newSubTasksBeingEdited[newSubTaskIndex] = {
      errorMessage: undefined,
      index: newSubTaskIndex,
      subTask: { description: "", customId: newId() }
    };

    setSubTasksBeingEdited(newSubTasksBeingEdited);
  };

  const onCommitSubTaskUpdate = (index: string | number) => {
    const subTask = subTasksBeingEdited[index];
    const error = validateSubTask(subTask.subTask);

    if (error) {
      onUpdateSubTask(index, subTask.subTask);
    } else {
      const newSubTasks = [...subTasks];

      if (Number(index) >= newSubTasks.length) {
        newSubTasks.push(subTask.subTask);
      } else {
        newSubTasks[index] = subTask.subTask;
      }

      removeSubTaskFromSubTasksBeingEdited(index);
      onChange(newSubTasks);
    }
  };

  const renderSubTask = (subTask: ISubTaskValues, index: string | number) => {
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

  const renderSubTaskList = () => {
    const newSubTasks: ISubTaskState[] = [];

    forIn(subTasksBeingEdited, (subTaskState, key) => {
      const index = Number(key);

      if (index >= subTasks.length) {
        newSubTasks.push(subTaskState);
      }
    });

    return (
      <React.Fragment>
        {subTasks.map((subTask, index) => (
          <React.Fragment key={subTask.customId}>
            {renderSubTask(subTask, index)}
            <Divider />
          </React.Fragment>
        ))}
        {newSubTasks.map((subTaskState, index) => (
          <React.Fragment key={subTaskState.subTask.customId}>
            {renderSubTask(subTaskState.subTask, subTaskState.index)}
            {index > newSubTasks.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  };

  return (
    <div>
      {canAddSubTasks && (
        <StyledContainerAsLink
          role="button"
          onClick={onAddSubTask}
          s={{ display: "block", lineHeight: "16px", marginBottom: "16px" }}
        >
          <Icon type="plus-circle" theme="twoTone" /> Add sub-task
        </StyledContainerAsLink>
      )}
      {renderSubTaskList()}
    </div>
  );
};

export default SubTaskList;
