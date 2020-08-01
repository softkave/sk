import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import MainDesktopContainer from "../components/layout/MainDesktopContainer";
import MainMobile from "../components/layout/MainMobile";
import { isPath0App, makePath, paths } from "../components/layout/path";
import RenderForDevice from "../components/RenderForDevice";
import StyledContainer from "../components/styled/Container";
import { connectSocket } from "../net/socket";
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
  const token = useSelector(SessionSelectors.getUserToken);

  React.useEffect(() => {
    if (sessionType === SessionType.Uninitialized) {
      dispatch(initializeAppSessionOperationAction({ opId }));
    }
  }, [sessionType, opId, dispatch]);

  React.useEffect(() => {
    if (sessionType === SessionType.App) {
      connectSocket({
        token: token!,
      });

      if (!isPath0App()) {
        history.push(makePath(paths.appPath));
      }
    } else if (sessionType === SessionType.Web) {
      if (isPath0App()) {
        history.push("/");
      }
    }
  }, [sessionType]);

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
    case SessionType.App:
      return (
        <RenderForDevice
          renderForDesktop={() => <MainDesktopContainer />}
          renderForMobile={() => <MainMobile />}
        />
      );

    case SessionType.Web:
      return <Routes />;

    case SessionType.Uninitialized:
    case SessionType.Initializing:
    default:
      return renderInitializing();
  }
};

export default Main;
