import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { isPath0App, makePath, paths } from "../components/layout/path";
import initializeAppSessionOperationFunc from "../redux/operations/session/initializeAppSession";
import { getSessionType } from "../redux/session/selectors";
import App from "./App";
import Routes from "./Routes";

const Main: React.FC<{}> = props => {
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
        console.log("i moved it");
        history.push(makePath(paths.appPath));
      }
    } else if (sessionType === "web") {
      if (isPath0App()) {
        history.push("/");
      }
    }
  }, [sessionType, history]);

  switch (sessionType) {
    case "app":
      return <App />;

    case "web":
      return <Routes />;

    case "uninitialized":
    case "initializing":
    default:
      // TODO: should we change this to "logging in?"
      // TODO: should we show something here? And if we do, it's kind of breaking the layout for that split second
      return null;
  }
};

export default Main;
