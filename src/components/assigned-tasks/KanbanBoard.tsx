import styled from "@emotion/styled";
import React from "react";
import { IBlock } from "../../models/block/block";

export interface IAssignedTasksKanbanBoardProps {
  tasks: IBlock[];
  parents: IBlock[];
}

const AssignedTasksKanbanBoard: React.SFC<
  IAssignedTasksKanbanBoardProps
> = props => {
  return null;
};

export default AssignedTasksKanbanBoard;
