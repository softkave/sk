import { Divider, Empty } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch, useHistory } from "react-router";
import { IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import getTasksAssignedToUserOperationFunc from "../../redux/operations/block/getTasksAssignedToUser";
import { getTasksAssignedToUserOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { sortBlocksByPriority } from "../block/sortBlocks";
import BoardBaskets, { IBoardBasket } from "../board/BoardBaskets";
import ColumnWithTitleAndCount from "../board/ColumnWithTitleAndContent";
import { concatPaths } from "../layout/path";
import SingleOperationHelper, {
  ISingleOperationHelperDerivedProps
} from "../OperationHelper";
import RenderForDevice from "../RenderForDevice";
import StyledCenterContainer from "../styled/CenterContainer";
import StyledContainer from "../styled/Container";
import TaskList from "../task/TaskList";
import { sortAssignedTasksByDueDate } from "./sortAssignedTasks";

interface IAssignedTasksBasket extends IBoardBasket {
  title: string;
}

const AssignedTasksMain: React.FC<{}> = props => {
  const user = useSelector(getSignedInUserRequired);
  const assignedTasks = useSelector<IReduxState, IBlock[]>(state =>
    getBlocksAsArray(state, user.assignedTasks || [])
  );
  const history = useHistory();
  const loadAssignedTasks = (
    helperProps: ISingleOperationHelperDerivedProps
  ) => {
    const shouldLoadAssignedTasks = () => {
      return !!!helperProps.operation;
    };

    if (shouldLoadAssignedTasks()) {
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
    const renderBody = () => {
      return (
        <TaskList
          isDragDisabled
          isDropDisabled
          selectedCollaborators={{}}
          tasks={columnTasks}
        />
      );
    };

    return (
      <ColumnWithTitleAndCount
        title={title}
        count={columnTasks.length}
        body={renderBody()}
      />
    );
  };

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

  const getBaskets = () => {
    const baskets: IAssignedTasksBasket[] = [
      { key: "dueAlready", title: "Due Already", items: dueAlready },
      { key: "dueToday", title: "Due Today", items: dueToday },
      { key: "dueTomorrow", title: "Due Tomorrow", items: dueTomorrow },
      { key: "dueThisWeek", title: "Due This Week", items: dueThisWeek },
      { key: "dueThisMonth", title: "Due This Month", items: dueThisMonth },
      { key: "rest", title: remainingTasksTitle, items: rest }
    ];

    return baskets;
  };

  const renderBasket = (basket: IAssignedTasksBasket) => {
    if (basket.items.length === 0) {
      return null;
    }

    return renderColumn(basket.title, sortBlocksByPriority(basket.items));
  };

  const onNavigateToBasket = (basketPath: string) => {
    const path = concatPaths(window.location.pathname, basketPath);
    history.push(path);
  };

  const renderMobileLandingMenu = () => (
    <StyledContainer
      s={{ padding: "0 16px", flexDirection: "column", width: "100%" }}
    >
      <h1>Assigned Tasks</h1>
      <StyledContainer onClick={() => onNavigateToBasket("due-already")}>
        <StyledContainer s={{ flex: 1 }}> Due Already</StyledContainer>

        <span>{dueAlready.length}</span>
      </StyledContainer>
      <Divider />
      <StyledContainer onClick={() => onNavigateToBasket("due-today")}>
        <StyledContainer s={{ flex: 1 }}> Due Today</StyledContainer>

        <span>{dueToday.length}</span>
      </StyledContainer>
      <Divider />
      <StyledContainer onClick={() => onNavigateToBasket("due-tomorrow")}>
        <StyledContainer s={{ flex: 1 }}> Due Tomorrow</StyledContainer>
        <span>{dueTomorrow.length}</span>
      </StyledContainer>
      <Divider />
      <StyledContainer onClick={() => onNavigateToBasket("due-this-week")}>
        <StyledContainer s={{ flex: 1 }}> Due This Week</StyledContainer>
        <span>{dueThisWeek.length}</span>
      </StyledContainer>
      <Divider />
      <StyledContainer onClick={() => onNavigateToBasket("due-this-month")}>
        <StyledContainer s={{ flex: 1 }}> Due This Month</StyledContainer>
        <span>{dueThisMonth.length}</span>
      </StyledContainer>
      <Divider />
      <StyledContainer onClick={() => onNavigateToBasket("rest")}>
        <StyledContainer s={{ flex: 1 }}>{remainingTasksTitle}</StyledContainer>
        <span>{rest.length}</span>
      </StyledContainer>
    </StyledContainer>
  );

  const renderMobileBasket = (title: string, basketTasks: IBlock[]) => (
    <StyledContainer
      s={{ flexDirection: "column", width: "100%", padding: "0 16px" }}
    >
      <h3>{title}</h3>
      <TaskList selectedCollaborators={{}} tasks={basketTasks} />
    </StyledContainer>
  );

  const renderAssignedTasksForMobile = () => {
    return (
      <Switch>
        <Route
          exact
          path="/app/assigned-tasks"
          render={renderMobileLandingMenu}
        />
        <Route
          exact
          path="/app/assigned-tasks/due-already"
          render={() => renderMobileBasket("Due Already", dueAlready)}
        />
        <Route
          exact
          path="/app/assigned-tasks/due-today"
          render={() => renderMobileBasket("Due Today", dueToday)}
        />
        <Route
          exact
          path="/app/assigned-tasks/due-tomorrow"
          render={() => renderMobileBasket("Due Tomorrow", dueTomorrow)}
        />
        <Route
          exact
          path="/app/assigned-tasks/due-this-week"
          render={() => renderMobileBasket("Due This Week", dueThisWeek)}
        />
        <Route
          exact
          path="/app/assigned-tasks/due-this-month"
          render={() => renderMobileBasket("Due This Month", dueThisMonth)}
        />
        <Route
          exact
          path="/app/assigned-tasks/rest"
          render={() => renderMobileBasket(remainingTasksTitle, rest)}
        />
        <Route
          exact
          path="/app/assigned-tasks/*"
          render={() => <Redirect to="/app/assigned-tasks" />}
        />
      </Switch>
    );
  };

  const renderAssignedTasksForDesktop = () => {
    if (assignedTasks.length === 0) {
      return renderEmptyList();
    }

    // const sortResult = sortAssignedTasksByDueDate(assignedTasks);
    // const hasNoneDue = sortResult.rest.length === assignedTasks.length;

    return (
      <StyledContainer s={{ overflowX: "auto", marginLeft: "16px" }}>
        <BoardBaskets
          id="AssignedTasks"
          blocks={assignedTasks}
          getBaskets={getBaskets}
          renderBasket={renderBasket}
        />
      </StyledContainer>
    );
  };

  // TODO: Should we refactor this, it is used in multiple places?
  const render = () => {
    return (
      <RenderForDevice
        renderForDesktop={renderAssignedTasksForDesktop}
        renderForMobile={renderAssignedTasksForMobile}
      />
    );
  };

  return (
    <SingleOperationHelper
      operationID={getTasksAssignedToUserOperationID}
      render={render}
      loadFunc={loadAssignedTasks}
    />
  );
};

export default AssignedTasksMain;

// TODO: Global header for desktop
// TODO: Shadow header for mobile
