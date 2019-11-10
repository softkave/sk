import styled from "@emotion/styled";
import moment from "moment";
import React from "react";
import { IBlock } from "../../models/block/block";
import Column from "../board/Column";
import ColumnBody from "../board/ColumnBody";
import ColumnHeader from "../board/ColumnHeader";

export interface IAssignedTasksKanbanBoardProps {
  tasks: IBlock[];
  parents: IBlock[];
}

const AssignedTasksKanbanBoard: React.SFC<
  IAssignedTasksKanbanBoardProps
> = props => {
  const { tasks } = props;

  const endOfDay = moment()
    .hour(23)
    .minute(59)
    .second(59);
  const endOfTomorrow = moment()
    .add(1, "day")
    .hour(23)
    .minute(59)
    .second(59);
  const endOfWeek = moment()
    .day("Friday")
    .hour(23)
    .minute(59)
    .second(59);
  const endOfMonth = moment()
    .dates(31)
    .hour(23)
    .minute(59)
    .second(59);
  const dueToday: IBlock[] = [];
  const dueTomorrow: IBlock[] = [];
  const dueThisWeek: IBlock[] = [];
  const dueThisMonth: IBlock[] = [];
  const rest: IBlock[] = [];

  tasks.forEach(task => {
    const dueDate = task.expectedEndAt && moment(task.expectedEndAt);

    if (dueDate) {
      if (dueDate.isBefore(endOfDay)) {
        dueToday.push(task);
      } else if (dueDate.isBefore(endOfTomorrow)) {
        dueTomorrow.push(task);
      } else if (dueDate.isBefore(endOfWeek)) {
        dueThisWeek.push(task);
      } else if (dueDate.isBefore(endOfMonth)) {
        dueThisMonth.push(task);
      } else {
        rest.push(task);
      }
    } else {
      rest.push(task);
    }
  });

  const renderColumn = (title: string, children: React.ReactNode) => {
    return (
      <Column>
        <ColumnHeader title={title} />
        <ColumnBody>{children}</ColumnBody>
      </Column>
    );
  };

  const renderTasks = () => {
    return null;
  };

  return null;
};

export default AssignedTasksKanbanBoard;
