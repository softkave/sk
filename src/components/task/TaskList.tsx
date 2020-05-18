import styled from "@emotion/styled";
import isObject from "lodash/isObject";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { IBlock } from "../../models/block/block";
import { sortBlocksByPriority } from "../block/sortBlocks";
import StyledContainer from "../styled/Container";
import List from "../styled/List";
import Task from "./Task";

export interface ITaskListProps {
  tasks: IBlock[];

  noDnD?: boolean;
  droppableType?: string;
  droppableId?: string;
  block?: IBlock;
  isDragDisabled?: boolean;
  isDropDisabled?: boolean;
  selectedCollaborators?: { [key: string]: boolean };
  toggleForm?: (block: IBlock) => void;
}

const TaskList: React.FC<ITaskListProps> = (props) => {
  const {
    toggleForm,
    selectedCollaborators,
    tasks,
    isDragDisabled,
    isDropDisabled,
    block,
    droppableId,
    droppableType,
    noDnD,
  } = props;
  const filteredTasks =
    isObject(selectedCollaborators) &&
    Object.keys(selectedCollaborators).length > 0
      ? tasks.filter((task) => {
          const tc = task.taskCollaborators;

          if (Array.isArray(tc) && tc.length > 0) {
            return tc.find((c) => selectedCollaborators[c.userId]);
          }

          return false;
        })
      : tasks;

  const tasksToRender = sortBlocksByPriority(filteredTasks);

  const renderTask = (task: IBlock, i: number) => {
    const isNotLastTask = i < tasksToRender.length - 1;
    const isFirstTask = i === 0;

    if (noDnD) {
      return (
        <StyledBlockThumbnailContainer
          key={task.customId}
          style={{
            borderBottom: isNotLastTask ? "1px solid #f0f0f0" : undefined,
            paddingBottom: isNotLastTask ? "16px" : undefined,
            paddingTop: isFirstTask ? 0 : undefined,
          }}
        >
          <Task
            task={task}
            onEdit={
              toggleForm ? (editedTask) => toggleForm(editedTask) : undefined
            }
          />
        </StyledBlockThumbnailContainer>
      );
    }

    return (
      <Draggable
        isDragDisabled={isDragDisabled}
        key={task.customId}
        draggableId={task.customId}
        index={i}
      >
        {(provided, snapshot) => {
          return (
            <StyledBlockThumbnailContainer
              key={task.customId}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                borderBottom: isNotLastTask ? "1px solid #f0f0f0" : undefined,
                paddingBottom: isNotLastTask ? "16px" : undefined,
                paddingTop: isFirstTask ? 0 : undefined,
                backgroundColor: snapshot.isDragging ? "#eee" : undefined,
                cursor: snapshot.isDragging ? "grabbing" : undefined,
                ...provided.draggableProps.style,
              }}
            >
              <Task
                task={task}
                onEdit={
                  toggleForm
                    ? (editedTask) => toggleForm(editedTask)
                    : undefined
                }
              />
            </StyledBlockThumbnailContainer>
          );
        }}
      </Draggable>
    );
  };

  const renderList = () => {
    return (
      <List
        dataSource={tasksToRender}
        rowKey="customId"
        emptyDescription="No tasks available."
        renderItem={renderTask}
      />
    );
  };

  if (block && !noDnD) {
    return (
      <Droppable
        droppableId={droppableId || block.customId}
        type={droppableType || "task"}
        // direction="horizontal"
        isDropDisabled={isDropDisabled}
      >
        {(provided, snapshot) => {
          return (
            <StyledContainer
              ref={provided.innerRef}
              style={{ flexDirection: "column", width: "100%", height: "100%" }}
              {...provided.droppableProps}
            >
              {renderList()}
              {provided.placeholder}
            </StyledContainer>
          );
        }}
      </Droppable>
    );
  }

  return (
    <StyledContainer
      style={{ flexDirection: "column", width: "100%", height: "100%" }}
    >
      {renderList()}
    </StyledContainer>
  );
};

const StyledBlockThumbnailContainer = styled.div`
  margin: 24px 0px;
`;

export default React.memo(TaskList);
