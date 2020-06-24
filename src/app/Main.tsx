import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import MainLayoutContainer from "../components/layout/MainLayoutContainer";
import { isPath0App, makePath, paths } from "../components/layout/path";
import StyledContainer from "../components/styled/Container";
import { initializeAppSessionOperationAction } from "../redux/operations/session/initializeAppSession";
import SessionSelectors from "../redux/session/selectors";
import { SessionType } from "../redux/session/types";
import { AppDispatch } from "../redux/types";
import { newId } from "../utils/utils";
import Routes from "./Routes";

const Main: React.FC<{}> = () => {
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();
  const [opId] = React.useState(() => newId());
  const sessionType = useSelector(SessionSelectors.getSessionType);

  React.useEffect(() => {
    if (sessionType === SessionType.Uninitialized) {
      dispatch(initializeAppSessionOperationAction({ opId }));
    }
  }, [sessionType, opId]);

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
