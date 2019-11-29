import { Empty } from "antd";
import React from "react";
import Media from "react-media";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
// import { aggregateBlocksParentIDs } from "../../models/block/utils";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import getTasksAssignedToUserOperationFunc from "../../redux/operations/block/getTasksAssignedToUser";
import {
  getTasksAssignedToUserOperationID,
  loadUserNotificationsOperationID
} from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { sortBlocksByPriority } from "../block/sortBlocks";
import Column from "../board/Column";
import Loading from "../Loading";
import StyledCenterContainer from "../styled/CenterContainer";
import TaskList from "../task/TaskList";
import theme from "../theme";
import OH, { IOHDerivedProps } from "../utils/OH";
import OperationHelper, {
  IOperationHelperDerivedProps
} from "../utils/OperationHelper";
import { sortAssignedTasksByDueDate } from "./sortAssignedTasks";

export interface INotificationsPathParams {
  notificationID?: string;
}

const AssignedTasks: React.SFC<{}> = props => {
  const user = useSelector(getSignedInUserRequired);

  const areAssignedTasksLoaded = Array.isArray(user.assignedTasks);
  const assignedTasks = useSelector<IReduxState, IBlock[]>(state =>
    getBlocksAsArray(state, user.assignedTasks || [])
  );
  const total = assignedTasks.length;
  // const parentIDs = assignedTasks && aggregateBlocksParentIDs(assignedTasks);
  // const parents = useSelector<IReduxState, IBlock[]>(state =>
  //   getBlocksAsArray(state, parentIDs)
  // );

  const loadAssignedTasks = (helperProps: IOperationHelperDerivedProps) => {
    console.log("load function called", { helperProps });
    const shouldLoadAssignedTasks = () => {
      return !!!helperProps.operation;
    };

    if (shouldLoadAssignedTasks()) {
      console.log("load function called 2");
      getTasksAssignedToUserOperationFunc();
    }
  };

  const renderEmptyList = () => {
    return (
      <StyledCenterContainer>
        <Empty description="You currently have no assigned tasks." />
      </StyledCenterContainer>
    );
  };

  const renderColumn = (title: string, columnTasks: IBlock[]) => {
    const renderHeader = () => {
      return <span>{title}</span>;
    };

    const renderBody = () => {
      return <TaskList selectedCollaborators={{}} tasks={columnTasks} />;
    };

    if (columnTasks.length > 0) {
      return <Column header={renderHeader()} body={renderBody()} />;
    }

    return null;
  };

  const renderNotificationsForMobile = () => {
    return null;
  };

  const renderNotificationsForDesktop = () => {
    if (assignedTasks.length === 0) {
      return renderEmptyList();
    }

    const sortResult = sortAssignedTasksByDueDate(assignedTasks);
    const hasNoneDue = sortResult.rest.length === assignedTasks.length;
    console.log({ sortResult });

    return (
      <div>
        {renderColumn(
          "Due Already",
          sortBlocksByPriority(sortResult.dueAlready)
        )}
        {renderColumn("Due Today", sortBlocksByPriority(sortResult.dueToday))}
        {renderColumn(
          "Due Tomorrow",
          sortBlocksByPriority(sortResult.dueTomorrow)
        )}
        {renderColumn(
          "Due This Week",
          sortBlocksByPriority(sortResult.dueThisWeek)
        )}
        {renderColumn(
          "Due This Month",
          sortBlocksByPriority(sortResult.dueThisMonth)
        )}
        {renderColumn(
          hasNoneDue ? "Assigned Tasks" : "Rest",
          sortBlocksByPriority(sortResult.rest)
        )}
      </div>
    );
  };

  // TODO: Should we refactor this, it is used in multiple places?
  const render = (renderProps: IOHDerivedProps) => {
    console.log({ renderProps });
    return (
      <Media queries={{ mobile: `(min-width: ${theme.breakpoints.md})` }}>
        {matches => (
          <React.Fragment>
            {matches.mobile && renderNotificationsForMobile()}
            {!matches.mobile && renderNotificationsForDesktop()}
          </React.Fragment>
        )}
      </Media>
    );
  };

  return (
    <OH
      operationID={getTasksAssignedToUserOperationID}
      render={render}
      loadFunc={loadAssignedTasks}
    />
  );
};

export default AssignedTasks;

// TODO: Global header for desktop
// TODO: Shadow header for mobile
