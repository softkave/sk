import React from "react";
import { IBoard } from "../../models/board/types";
import { ICollaborator } from "../../models/collaborator/types";
import { ITask } from "../../models/task/types";
import RenderForDevice from "../RenderForDevice";
import { BoardGroupBy } from "./BoardHeaderOptionsMenu";
import GroupedTasksDesktop from "./GroupedTasksDesktop";
import GroupedTasksMobile from "./GroupedTasksMobile";
import { ITasksContainerRenderFnProps } from "./TasksContainer";
import { BoardGroupableFields, IBoardGroupedTasks } from "./types";
import groupByAssignees from "./utils/groupByAssignees";
import groupByLabels from "./utils/groupByLabels";
import groupByStatus from "./utils/groupByStatus";

export interface IGroupedTasksProps extends ITasksContainerRenderFnProps {
  board: IBoard;
  tasks: ITask[];
  collaborators: ICollaborator[];
  groupType: BoardGroupBy;
  onClickUpdateTask: (task: ITask) => void;
}

function getGroupFieldName(groupType: BoardGroupBy): BoardGroupableFields {
  switch (groupType) {
    case BoardGroupBy.SPRINT:
      return "sprint";
    case BoardGroupBy.ASSIGNEES:
      return "assignees";
    case BoardGroupBy.LABELS:
      return "labels";
    case BoardGroupBy.STATUS:
      return "status";
  }
}

const GroupedTasks: React.FC<IGroupedTasksProps> = (props) => {
  const { board: block, tasks, collaborators, groupType } = props;
  let groupedTasks: IBoardGroupedTasks[] = React.useMemo(() => {
    switch (groupType) {
      case BoardGroupBy.STATUS:
        return groupByStatus(block.boardStatuses || [], tasks);
      case BoardGroupBy.LABELS:
        return groupByLabels(block.boardLabels || [], tasks);
      case BoardGroupBy.ASSIGNEES:
        return groupByAssignees(
          collaborators,
          tasks,
          block.boardStatuses || []
        );
    }

    return [];
    // TODO: debounce fetching tasks and collaborators from redux
  }, [block.boardStatuses, block.boardLabels, tasks, groupType, collaborators]);

  const renderGroupedTasksDesktop = () => {
    return (
      <GroupedTasksDesktop
        {...props}
        groupedTasks={groupedTasks}
        groupFieldName={getGroupFieldName(groupType)}
      />
    );
  };

  const renderGroupedTasksMobile = () => {
    return <GroupedTasksMobile {...props} groupedTasks={groupedTasks} />;
  };

  return (
    <RenderForDevice
      renderForMobile={renderGroupedTasksMobile}
      renderForDesktop={renderGroupedTasksDesktop}
    />
  );
};

export default GroupedTasks;
