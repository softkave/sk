import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import MainLayoutContainer from "../components/layout/MainLayoutContainer";
import { isPath0App, makePath, paths } from "../components/layout/path";
import StyledContainer from "../components/styled/Container";
import initializeAppSessionOperationFunc from "../redux/operations/session/initializeAppSession";
import { getSessionType } from "../redux/session/selectors";
import Routes from "./Routes";

const Main: React.FC<{}> = () => {
  const history = useHistory();
  const sessionType = useSelector(getSessionType);

  React.useEffect(() => {
    if (sessionType === "uninitialized") {
      initializeAppSessionOperationFunc();
    }
  });

  React.useEffect(() => {
    if (sessionType === "app") {
      if (!isPath0App()) {
        history.push(makePath(paths.appPath));
      }
    } else if (sessionType === "web") {
      if (isPath0App()) {
        history.push("/");
      }
    }
  }, [sessionType, history]);

  const renderInitializing = () => (
    <StyledContainer
      s={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
      }}
    >
      ...
    </StyledContainer>
  );

  switch (sessionType) {
    case "app":
      return <MainLayoutContainer />;

    case "web":
      return <Routes />;

    case "uninitialized":
    case "initializing":
    default:
      return renderInitializing();
  }
};

export default Main;
