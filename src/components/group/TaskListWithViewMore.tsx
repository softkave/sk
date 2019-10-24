import styled from "@emotion/styled";
import React from "react";

import { IBlock } from "../../models/block/block";
import { sortBlocksByPriority } from "../block/sortBlocks";
import TaskList, { ITaskListProps } from "./TaskList";

interface IRenderInfo {
  sortedTasks: IBlock[];
  tasksToRender: IBlock[];
  renderNum: number;
  showViewMore: boolean;
  viewMoreCount: number;
}

export interface ITaskListWithViewMoreProps extends ITaskListProps {
  onViewMore: () => void;
}

class TaskListWithViewMore extends React.PureComponent<
  ITaskListWithViewMoreProps
> {
  public isAnyCollaboratorSelected() {
    const { selectedCollaborators } = this.props;
    return (
      selectedCollaborators && Object.keys(selectedCollaborators).length > 0
    );
  }

  public getRenderInfo(tasks: IBlock[]): IRenderInfo {
    const showAllTasks = this.isAnyCollaboratorSelected();
    const sortedTasks = sortBlocksByPriority(tasks);

    if (showAllTasks) {
      return {
        sortedTasks,
        tasksToRender: sortedTasks,
        renderNum: tasks.length,
        showViewMore: false,
        viewMoreCount: 0
      };
    }

    // TODO: Add sorting by expiration date
    let veryImportantTasksNum = 0;

    // Very important tasks will always be displayed
    for (const task of sortedTasks) {
      // TODO: If perf is slow, consider mapping to boolean and comparing that instead
      if (task.priority === "very important") {
        veryImportantTasksNum += 1;
      } else {
        /**
         * Optimization:
         * Since all the tasks are sorted by priority,
         * we can break when we encounter a task that is not very important
         */
        break;
      }
    }

    const maxTasksToRender = tasks.length < 5 ? tasks.length : 5;
    const renderNum =
      veryImportantTasksNum < maxTasksToRender
        ? maxTasksToRender
        : veryImportantTasksNum;

    return {
      renderNum,
      sortedTasks,
      tasksToRender: sortedTasks.slice(0, renderNum),
      showViewMore: !(renderNum === tasks.length),
      viewMoreCount: tasks.length - renderNum
    };
  }

  public render() {
    const {
      tasks,
      onViewMore: onExpand,
      blockHandlers,
      selectedCollaborators,
      user,
      toggleForm
    } = this.props;
    const stat = this.getRenderInfo(tasks);

    return (
      <React.Fragment>
        <TaskList
          blockHandlers={blockHandlers}
          selectedCollaborators={selectedCollaborators}
          user={user}
          tasks={stat.tasksToRender}
          toggleForm={toggleForm}
        />
        {stat.showViewMore && (
          <ViewMoreContainer onClick={onExpand}>
            View More | {stat.viewMoreCount}
          </ViewMoreContainer>
        )}
      </React.Fragment>
    );
  }
}

const ViewMoreContainer = styled.div`
  padding: 12px;
  border-top: 1px solid #ddd;
  cursor: pointer;
  font-weight: bold;
`;

export default TaskListWithViewMore;
