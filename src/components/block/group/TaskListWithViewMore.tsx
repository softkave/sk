import styled from "@emotion/styled";
import React from "react";

import { IBlock } from "../../../models/block/block.js";
import { sortBlocksByPriority } from "./sortBlocks.js";
import TaskList, { ITaskListProps } from "./TaskList.jsx";

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

  // TODO: Rename function
  public getTaskStat(tasks: IBlock[]) {
    const showAll = this.isAnyCollaboratorSelected();
    const sortedTasks = sortBlocksByPriority(tasks);

    if (showAll) {
      return {
        sortedTasks,
        renderTasks: sortedTasks,
        renderNum: tasks.length,
        showViewMore: false,
        viewMoreCount: 0
      };
    }

    // TODO: Add sorting by expiration date

    let veryImportantNum = 0;

    for (const task of sortedTasks) {
      // TODO: If perf is slow, consider mapping to boolean and comparing that instead
      if (task.priority === "very important") {
        veryImportantNum += 1;
      } else {
        break;
      }
    }

    const defaultMaxRenderedTasks = tasks.length < 5 ? tasks.length : 5;
    const renderNum =
      veryImportantNum < defaultMaxRenderedTasks
        ? defaultMaxRenderedTasks
        : veryImportantNum;

    return {
      renderNum,
      sortedTasks,
      renderTasks: sortedTasks.slice(0, renderNum),
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
      parent,
      toggleForm
    } = this.props;
    const stat = this.getTaskStat(tasks);

    return (
      <React.Fragment>
        <TaskList
          blockHandlers={blockHandlers}
          selectedCollaborators={selectedCollaborators}
          user={user}
          tasks={stat.renderTasks}
          parent={parent}
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
