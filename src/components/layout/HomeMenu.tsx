import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { IUserSessionDetails } from "../../models/user/user";
import OperationIDs from "../../redux/operations/operationIDs";
import getSessionDetailsOperationFunc from "../../redux/operations/session/getSessionDetails";
import logoutUserOperationFunc from "../../redux/operations/session/logoutUser";
import { getSessionDetails } from "../../redux/session/selectors";
import cast from "../../utils/cast";
import GeneralErrorList from "../GeneralErrorList";
import useOperation from "../hooks/useOperation";
import StyledContainer from "../styled/Container";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import MenuItem from "../utilities/MenuItem";

const HomeMenu: React.FC<{}> = () => {
  const history = useHistory();

  const onLogout = () => {
    logoutUserOperationFunc();
  };

  const navigateToPath = (key: string) => {
    const path = `/app/${key}`;
    history.push(path);
  };

  const sessionDetails =
    useSelector(getSessionDetails) || cast<IUserSessionDetails>({});
  const sessionDetailsOperation = useOperation(
    { operationID: OperationIDs.getSessionDetails },
    loadProps => {
      if (!!!loadProps.operation) {
        getSessionDetailsOperationFunc();
      }
    }
  );

  if (sessionDetailsOperation.isLoading) {
    return <LoadingEllipsis />;
  } else if (sessionDetailsOperation.isError) {
    return <GeneralErrorList errors={sessionDetailsOperation.error} />;
  }

  return (
    <StyledContainer
      s={{
        flexDirection: "column"
      }}
    >
      <StyledContainer s={{ flex: 1 }}>
        <MenuItem
          key="notifications"
          iconType="mail"
          name={
            sessionDetails.notificationsCount > 0
              ? "Notifications"
              : "Notification"
          }
          count={sessionDetails.notificationsCount}
          unseenCount={sessionDetails.unseenNotificationsCount}
          onClick={() => navigateToPath("notifications")}
        />
        <MenuItem
          key="assigned-tasks"
          iconType="schedule"
          name={
            sessionDetails.assignedTasksCount > 0
              ? "Assigned Tasks"
              : "Assigned Task"
          }
          count={sessionDetails.assignedTasksCount}
          unseenCount={sessionDetails.unseenAssignedTasksCount}
          onClick={() => navigateToPath("assigned-tasks")}
        />
        <MenuItem
          key="organizations"
          iconType="block"
          name={
            sessionDetails.organizationsCount > 0
              ? "Organizations"
              : "Organization"
          }
          count={sessionDetails.organizationsCount}
          unseenCount={sessionDetails.unseenOrganizationsCount}
          onClick={() => navigateToPath("organizations")}
        />
      </StyledContainer>
      <MenuItem
        key="logout"
        iconType="logout"
        name="Logout"
        style={{ color: "rgb(255, 77, 79)", marginTop: "32px" }}
        onClick={onLogout}
      />
    </StyledContainer>
  );
};

export default HomeMenu;
