import { BlockOutlined, LogoutOutlined, MailOutlined } from "@ant-design/icons";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { IUserSessionDetails } from "../../models/user/user";
import OperationIds from "../../redux/operations/operationIds";
import getSessionDetailsOperationFunc from "../../redux/operations/session/getSessionDetails";
import logoutUserOperationFunc from "../../redux/operations/session/logoutUser";
import { getSessionDetails } from "../../redux/session/selectors";
import cast from "../../utils/cast";
import GeneralErrorList from "../GeneralErrorList";
import useOperation from "../hooks/useOperation";
import StyledContainer from "../styled/Container";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import MenuItem from "../utilities/MenuItem";

// TODO: should we remove HomeMenu, and where do we show the user details, like orgs count?
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
    { operationId: OperationIds.getSessionDetails },
    (loadProps) => {
      if (!!!loadProps.operation) {
        getSessionDetailsOperationFunc();
      }
    }
  );

  if (sessionDetailsOperation.isLoading) {
    return <LoadingEllipsis />;
  } else if (sessionDetailsOperation.isError) {
    return <GeneralErrorList fill errors={sessionDetailsOperation.error} />;
  }

  return (
    <StyledContainer
      s={{
        flexDirection: "column",
        maxWidth: "400px",
        width: "100%",
        margin: "32px auto",
        flex: 1,
        padding: "0 16px",
      }}
    >
      <StyledContainer s={{ flex: 1, flexDirection: "column" }}>
        <MenuItem
          key="notifications"
          icon={<MailOutlined />}
          content={
            sessionDetails.notificationsCount === 1
              ? "Notification"
              : "Notifications"
          }
          count={sessionDetails.notificationsCount}
          onClick={() => navigateToPath("notifications")}
        />
        <MenuItem
          key="organizations"
          icon={<BlockOutlined />}
          content={
            sessionDetails.organizationsCount === 1
              ? "Organization"
              : "Organizations"
          }
          count={sessionDetails.organizationsCount}
          onClick={() => navigateToPath("organizations")}
        />
      </StyledContainer>
      <MenuItem
        key="logout"
        icon={<LogoutOutlined />}
        content="Logout"
        style={{ color: "rgb(255, 77, 79)", marginTop: "32px" }}
        onClick={onLogout}
      />
    </StyledContainer>
  );
};

export default HomeMenu;
