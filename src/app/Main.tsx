import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import Loading from "../components/Loading";
import initializeAppSessionOperationFunc from "../redux/operations/session/initializeAppSession";
import { getSessionType } from "../redux/session/selectors";
import App from "./App";
import Routes from "./Routes";

const Main: React.SFC<{}> = props => {
  const history = useHistory();
  const sessionType = useSelector(getSessionType);

  React.useEffect(() => {
    if (sessionType === "uninitialized") {
      initializeAppSessionOperationFunc();
    }
  });

  // React.useEffect(() => {
  //   if (sessionType === "app") {
  //     if ()
  //   } else {

  //   }
  // });

  switch (sessionType) {
    case "app":
      return <App />;

    case "web":
      return <Routes />;

    case "uninitialized":
    case "initializing":
    default:
      return <Loading />;
  }
};

export default Main;
