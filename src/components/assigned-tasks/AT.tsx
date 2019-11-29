import { Empty } from "antd";
import React from "react";
import Media from "react-media";
import { useDispatch, useStore } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { aggregateBlocksParentIDs } from "../../models/block/utils";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import getTasksAssignedToUserOperationFunc from "../../redux/operations/block/getTasksAssignedToUser";
import loadUserNotificationsOperationFunc from "../../redux/operations/notification/loadUserNotifications";
import { loadUserNotificationsOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import StyledCenterContainer from "../styled/CenterContainer";
import theme from "../theme";
import OperationHelper, {
  IOperationHelperDerivedProps
} from "../utils/OperationHelper";

export interface INotificationsPathParams {
  notificationID?: string;
}

const AssignedTasks: React.SFC<{}> = props => {
  const history = useHistory();
  const routeMatch = useRouteMatch<INotificationsPathParams>()!;
  const store = useStore<IReduxState>();
  const dispatch = useDispatch();
  const state = store.getState();
  const user = getSignedInUserRequired(state);

  const areAssignedTasksLoaded = Array.isArray(user.assignedTasks);
  const assignedTasks =
    areAssignedTasksLoaded && getBlocksAsArray(state, user.assignedTasks!);
  const parentIDs = assignedTasks && aggregateBlocksParentIDs(assignedTasks);
  const parents = parentIDs && getBlocksAsArray(state, parentIDs);

  const loadAssignedTasks = (helperProps: IOperationHelperDerivedProps) => {
    const shouldLoadAssignedTasks = () => {
      return (
        !areAssignedTasksLoaded &&
        !(helperProps.isLoading || helperProps.isError)
      );
    };

    if (shouldLoadAssignedTasks()) {
      getTasksAssignedToUserOperationFunc(state, dispatch);
    }
  };

  const renderEmptyList = () => {
    return (
      <StyledCenterContainer>
        <Empty description="You currently have no notifications." />
      </StyledCenterContainer>
    );
  };

  const renderNotificationsForMobile = () => {
    return null;
  };

  const renderNotificationsForDesktop = () => {
    return null;
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
    <OperationHelper
      operationID={loadUserNotificationsOperationID}
      render={render}
      loadFunc={loadAssignedTasks}
    />
  );
};

export default AssignedTasks;

// TODO: Global header for desktop
// TODO: Shadow header for mobile
