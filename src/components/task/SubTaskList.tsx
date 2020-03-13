import { Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import { useSelector } from "react-redux";
import { ISubTask } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import SubTask, { ISubTaskErrors } from "./SubTask";

export interface ISubTaskListProps {
  subTasks: ISubTask[];
  onChange: (value: ISubTask[]) => void;
  errors?: ISubTaskErrors[];
}

interface ISubTaskState {
  customId: string;
  description: string;
}

const SubTaskList: React.SFC<ISubTaskListProps> = props => {
  const { subTasks: value, onChange, errors: subTaskErrors } = props;
  const subTasks = value || [];
  const errors = subTaskErrors || [];

  const [subTasksBeingEdited, setSubTasksBeingEdited] = React.useState<
    ISubTaskState[]
  >([]);
  const user = useSelector(getSignedInUserRequired);

  const getSubTaskIndexFromState = (id: string) =>
    subTasksBeingEdited.findIndex(subTaskState => subTaskState.customId === id);
  const getSubTaskIDIndexFromSubTasks = (id: string) =>
    subTasks.findIndex(subTask => subTask.customId === id);

  const isSubTaskBeingEdited = (id: string) => {
    return getSubTaskIndexFromState(id) !== -1;
  };

  const removeSubTaskFromSubTasksBeingEdited = (id: string) => {
    if (isSubTaskBeingEdited(id)) {
      const newSubTasksBeingEdited = [...subTasksBeingEdited];
      newSubTasksBeingEdited.splice(getSubTaskIndexFromState(id), 1);
      setSubTasksBeingEdited(newSubTasksBeingEdited);
    }
  };

  const onDeleteSubTask = (id: string) => {
    const newSubTasks = [...subTasks];
    newSubTasks.splice(getSubTaskIDIndexFromSubTasks(id), 1);
    removeSubTaskFromSubTasksBeingEdited(id);
    onChange(newSubTasks);
  };

  const onBeginEditSubTask = (id: string) => {
    const newSubTasksBeingEdited = [...subTasksBeingEdited];
    const subTask = subTasks[getSubTaskIDIndexFromSubTasks(id)];
    const newSubTaskState: ISubTaskState = {
      customId: id,
      description: subTask.description
    };
    newSubTasksBeingEdited.push(newSubTaskState);
    setSubTasksBeingEdited(newSubTasksBeingEdited);
  };

  const onUpdateSubTask = (id: string, update: ISubTask) => {
    const newSubTasks = [...subTasks];
    newSubTasks[getSubTaskIDIndexFromSubTasks(id)] = update;
    onChange(newSubTasks);
  };

  // const onAddSubTask = () => {
  //   const newSubTasks = [...subTasks];
  //   const newSubTasksBeingEdited = [...subTasksBeingEdited];
  //   const newSubTask: ISubTask = { description: "", customId: newId() };
  //   const newSubTaskState: ISubTaskState = {
  //     customId: newSubTask.customId,
  //     description: ""
  //   };
  //   newSubTasksBeingEdited.unshift(newSubTaskState);
  //   newSubTasks.unshift(newSubTask);
  //   setSubTasksBeingEdited(newSubTasksBeingEdited);
  //   onChange(newSubTasks);
  // };

  const onToggleSubTask = (id: string) => {
    const subTask = subTasks[getSubTaskIDIndexFromSubTasks(id)];
    const isCompleted = !!subTask.completedAt;
    const newSubTask: ISubTask = {
      ...subTask,
      completedAt: isCompleted ? null : Date.now(),
      completedBy: isCompleted ? null : user.customId
    };

    onUpdateSubTask(id, newSubTask);
  };

  const onCancelEditSubTask = (id: string) => {
    const subTaskState = subTasksBeingEdited[getSubTaskIndexFromState(id)];
    const subTask = subTasks[getSubTaskIDIndexFromSubTasks(id)];
    const newSubTask: ISubTask = {
      ...subTask,
      description: subTaskState.description
    };

    removeSubTaskFromSubTasksBeingEdited(id);
    onUpdateSubTask(id, newSubTask);
  };

  const onSaveSubTask = (id: string) => {
    const subTaskIndex = getSubTaskIDIndexFromSubTasks(id);
    const error = errors[subTaskIndex];
    const subTask = subTasks[subTaskIndex];

    if (error || subTask.description.length === 0) {
      onUpdateSubTask(id, subTask);
    } else {
      removeSubTaskFromSubTasksBeingEdited(id);
    }
  };

  const renderSubTask = (subTask: ISubTask, error: ISubTaskErrors = {}) => {
    const isEditing = isSubTaskBeingEdited(subTask.customId);
    const subTaskState: ISubTaskState =
      subTasksBeingEdited[getSubTaskIndexFromState(subTask.customId)];
    const onCancelEdit =
      subTaskState && subTaskState.description.length === 0
        ? undefined
        : () => onCancelEditSubTask(subTask.customId);

    return (
      <SubTask
        isEditing={isEditing}
        errorMessage={error.description}
        onCancelEdit={onCancelEdit}
        onChange={update => onUpdateSubTask(subTask.customId, update)}
        onDelete={() => onDeleteSubTask(subTask.customId)}
        onToggle={() => onToggleSubTask(subTask.customId)}
        onEdit={() => onBeginEditSubTask(subTask.customId)}
        onSave={() => onSaveSubTask(subTask.customId)}
        subTask={subTask}
      />
    );
  };

  const renderSubTaskList = () => {
    return (
      <React.Fragment>
        {subTasks.map((subTask, index) => (
          <React.Fragment key={subTask.customId}>
            {renderSubTask(subTask, errors[index])}
            {index < subTasks.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  };

  const renderLabel = () => {
    return (
      <StyledContainer
        s={{ width: "100%", lineHeight: "40px", fontWeight: 600 }}
      >
        <StyledContainer s={{ flex: 1 }}>
          Sub-tasks ({subTasks.length} of {blockConstants.maxSubTasksLength}):
        </StyledContainer>
        {subTasks.length < blockConstants.maxSubTasksLength && (
          <StyledFlatButton>
            <PlusOutlined />
          </StyledFlatButton>
        )}
      </StyledContainer>
    );
  };

  return (
    <div>
      {renderLabel()}
      {renderSubTaskList()}
    </div>
  );
};

export default SubTaskList;
