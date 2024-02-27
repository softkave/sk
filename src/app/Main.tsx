import { css } from "@emotion/css";
import { notification } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Redirect } from "react-router-dom";
import { useAppDispatch } from "../components/hooks/redux";
import { appRoutes } from "../models/app/routes";
import { isDemoUserId, isRegularUserId } from "../models/app/utils";
import SocketAPI from "../net/socket/socket";
import KeyValueActions from "../redux/key-value/actions";
import KeyValueSelectors from "../redux/key-value/selectors";
import { KeyValueKeys, appLoadingKeys } from "../redux/key-value/types";
import { initializeAppSessionOpAction } from "../redux/operations/session/initializeAppSession";
import { logoutUserOpAction } from "../redux/operations/session/logoutUser";
import { updateSocketEntryOpAction } from "../redux/operations/socket/updateSocketEntry";
import SessionSelectors from "../redux/session/selectors";
import { SessionType } from "../redux/session/types";
import { AppDispatch, IAppState } from "../redux/types";
import Routes from "./Routes";
import { useTrackAppVisibility } from "./useTrackAppVisibility";

const notLoggedInPaths = [
  appRoutes.signup,
  appRoutes.login,
  appRoutes.forgotPassword,
  appRoutes.changePassword,
];

const classes = {
  mainLoading: css({
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
  }),
};

const Main: React.FC<{}> = () => {
  const dispatch: AppDispatch = useDispatch();
  const sessionType = useSelector(SessionSelectors.getSessionType);
  const isUserLoggedIn = useSelector(SessionSelectors.isUserSignedIn);
  const userId = useSelector(SessionSelectors.getUserId);
  const isRegularUser = userId && isRegularUserId(userId);
  const location = useLocation();

  React.useEffect(() => {
    if (sessionType === SessionType.Uninitialized) {
      dispatch(initializeAppSessionOpAction({ key: appLoadingKeys.initializeAppSession }));
    }
  }, [sessionType, dispatch]);

  useTrackAppVisibility();
  useTrackLoginAgain();
  useConnectSocket(sessionType === SessionType.Initialized);

  let node: React.ReactNode = null;
  const matchedNonAppPath = isInNonAppPath(location.pathname);

  if (sessionType === SessionType.Initializing || sessionType === SessionType.Uninitialized) {
    node = <div className={classes.mainLoading}>...</div>;
  } else if (isRegularUser && !!matchedNonAppPath) {
    node = <Redirect to={appRoutes.app} />;
  } else if (!isUserLoggedIn && !matchedNonAppPath) {
    node = <Redirect to={appRoutes.home} />;
  } else {
    node = <Routes />;
  }

  return node;
};

function useTrackLoginAgain() {
  const dispatch = useAppDispatch();
  const [loginAgain] = useSelector((state) =>
    KeyValueSelectors.getMany(state as IAppState, [KeyValueKeys.LoginAgain])
  ) as Partial<[boolean]>;

  React.useEffect(() => {
    if (loginAgain) {
      notification.error({
        message: "Please login again",
        description: "An error occurred, please login again",
        duration: 15, // 15 seconds
      });

      dispatch(logoutUserOpAction);
      dispatch(
        KeyValueActions.setKey({
          key: KeyValueKeys.LoginAgain,
          value: false,
        })
      );
    }
  }, [loginAgain, dispatch]);
}

function useConnectSocket(isAppReady: boolean) {
  const dispatch: AppDispatch = useDispatch();
  const token = useSelector(SessionSelectors.getUserToken);
  const client = useSelector(SessionSelectors.getClient);
  const isUserLoggedIn = useSelector(SessionSelectors.isUserSignedIn);
  const userId = useSelector(SessionSelectors.getUserId);
  const isDemoUser = userId && isDemoUserId(userId);
  const clientId = client?.customId;
  const [isAppHidden] = useSelector((state) =>
    KeyValueSelectors.getMany(state as IAppState, [KeyValueKeys.IsAppHidden])
  ) as Partial<[boolean]>;

  React.useEffect(() => {
    if (isAppReady && isUserLoggedIn) {
      // TODO: Disconnect the socket maybe after 15 minutes
      // of app being hidden, and reconnect when the user returns
      dispatch(
        updateSocketEntryOpAction({
          isActive: !isAppHidden,
        })
      );
    }
  }, [isUserLoggedIn, isAppHidden, isAppReady, dispatch]);

  React.useEffect(() => {
    const socketConnected = SocketAPI.isConnectedWithToken(token);
    if (isAppReady) {
      if (isUserLoggedIn && !isDemoUser && token && clientId && !socketConnected) {
        SocketAPI.connectSocket({ token, clientId });
      } else if (socketConnected) {
        SocketAPI.disconnectSocket();
      }
    }
  }, [isUserLoggedIn, isDemoUser, token, clientId, isAppReady]);
}

function isInNonAppPath(p: string) {
  return p === "/" ? "/" : notLoggedInPaths.find((r) => p.startsWith(r));
}

export default Main;
