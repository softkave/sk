import styled from "@emotion/styled";
import moment from "moment";
import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { IBlockMethods } from "../block/methods";
import Column from "../board/Column";
import ColumnBody from "../board/ColumnBody";
import ColumnHeader from "../board/ColumnHeader";
import TaskList from "../group/TaskList";
import StyledHorizontalScrollContainer from "../styled/HorizontalScrollContainer";

export interface IAssignedTasksKanbanBoardProps {
  tasks: IBlock[];
  parents: IBlock[];
  blockHandlers: IBlockMethods;
  user: IUser;
}

class AssignedTasksKanbanBoard extends React.Component<
  IAssignedTasksKanbanBoardProps
> {
  public render() {
    const { tasks, blockHandlers, user } = this.props;

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
      .day("Saturday")
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

    const renderColumn = (title: string, columnTasks: IBlock[]) => {
      if (columnTasks.length > 0) {
        return (
          <StyledColumn>
            <ColumnHeader title={title} />
            <ColumnBody>
              <TaskList
                blockHandlers={blockHandlers}
                selectedCollaborators={{}}
                tasks={columnTasks}
                user={user}
              />
            </ColumnBody>
          </StyledColumn>
        );
      }

      return null;
    };

    const hasNoneDue = rest.length === tasks.length;

    return (
      <StyledAssignedTasksKanbanBoard>
        <StyledHeader>Assigned Tasks</StyledHeader>
        <StyledTasksContainer>
          <StyledTasksContainerInner>
            {renderColumn("Due Today", dueToday)}
            {renderColumn("Due Tomorrow", dueTomorrow)}
            {renderColumn("Due This Week", dueThisWeek)}
            {renderColumn("Due This Month", dueThisMonth)}
            {renderColumn(hasNoneDue ? "Assigned Tasks" : "Rest", rest)}
          </StyledTasksContainerInner>
        </StyledTasksContainer>
      </StyledAssignedTasksKanbanBoard>
    );
  }
}

export default AssignedTasksKanbanBoard;

const StyledAssignedTasksKanbanBoard = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%"
});

const StyledHeader = styled.div`
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
  padding: 16px;
`;

const StyledTasksContainer = styled(StyledHorizontalScrollContainer)({});

const StyledColumn = styled(Column)({
  marginRight: 16,

  "&:last-of-type": {
    marginRight: 0
  }
});

const StyledTasksContainerInner = styled.div`
  height: 100%;
  display: flex;
  padding: 16px;
  box-sizing: border-box;
`;
