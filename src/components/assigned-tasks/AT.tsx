import styled from "@emotion/styled";
import { Badge, Empty } from "antd";
import React from "react";
import Media from "react-media";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
// import { aggregateBlocksParentIDs } from "../../models/block/utils";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import getTasksAssignedToUserOperationFunc from "../../redux/operations/block/getTasksAssignedToUser";
import { getTasksAssignedToUserOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { sortBlocksByPriority } from "../block/sortBlocks";
import B, { IBBasket } from "../board/B";
import Column from "../board/Column";
import StyledCenterContainer from "../styled/CenterContainer";
import StyledFlexFillContainer from "../styled/FillContainer";
import TaskList from "../task/TaskList";
import theme from "../theme";
import OH, { IOHDerivedProps } from "../utils/OH";
import { sortAssignedTasksByDueDate } from "./sortAssignedTasks";

interface IAssignedTasksBasket extends IBBasket {
  title: string;
}

const AssignedTasks: React.FC<{}> = props => {
  const user = useSelector(getSignedInUserRequired);
  const assignedTasks = useSelector<IReduxState, IBlock[]>(state =>
    getBlocksAsArray(state, user.assignedTasks || [])
  );
  // const total = assignedTasks.length;
  // const parentIDs = assignedTasks && aggregateBlocksParentIDs(assignedTasks);
  // const parents = useSelector<IReduxState, IBlock[]>(state =>
  //   getBlocksAsArray(state, parentIDs)
  // );

  const loadAssignedTasks = (helperProps: IOHDerivedProps) => {
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
      return (
        <StyledFlexFillContainer>
          <StyledFlexFillContainer>
            <StyledTitle>{title}</StyledTitle>
          </StyledFlexFillContainer>
          <StyledColumnOtherContainer>
            <Badge count={columnTasks.length} />
          </StyledColumnOtherContainer>
        </StyledFlexFillContainer>
      );
    };

    const renderBody = () => {
      return <TaskList selectedCollaborators={{}} tasks={columnTasks} />;
    };

    if (columnTasks.length > 0) {
      return <Column header={renderHeader()} body={renderBody()} />;
    }

    return null;
  };

  const getBaskets = () => {
    const {
      dueAlready,
      dueToday,
      dueTomorrow,
      dueThisWeek,
      dueThisMonth,
      rest
    } = sortAssignedTasksByDueDate(assignedTasks);

    const hasNoneDue = rest.length === assignedTasks.length;
    const remainingTasksTitle = hasNoneDue ? "Assigned Tasks" : "Remaining";
    const baskets: IAssignedTasksBasket[] = [
      { key: "dueAlready", title: "Due Already", blocks: dueAlready },
      { key: "dueToday", title: "Due Today", blocks: dueToday },
      { key: "dueTomorrow", title: "Due Tomorrow", blocks: dueTomorrow },
      { key: "dueThisWeek", title: "Due This Week", blocks: dueThisWeek },
      { key: "dueThisMonth", title: "Due This Month", blocks: dueThisMonth },
      { key: "rest", title: remainingTasksTitle, blocks: rest }
    ];

    return baskets;
  };

  const renderBasket = (basket: IAssignedTasksBasket) => {
    return renderColumn(basket.title, sortBlocksByPriority(basket.blocks));
  };

  const renderNotificationsForMobile = () => {
    return null;
  };

  const renderNotificationsForDesktop = () => {
    if (assignedTasks.length === 0) {
      return renderEmptyList();
    }

    // const sortResult = sortAssignedTasksByDueDate(assignedTasks);
    // const hasNoneDue = sortResult.rest.length === assignedTasks.length;

    return (
      <B
        blocks={assignedTasks}
        getBaskets={getBaskets}
        renderBasket={renderBasket}
      />
    );
  };

  // TODO: Should we refactor this, it is used in multiple places?
  const render = () => {
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

const StyledColumnOtherContainer = styled.div({
  marginLeft: "16px"
});

const StyledTitle = styled.div({
  fontWeight: "bold"
});
