import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import initializeAppSessionOperationFunc from "../redux/operations/session/initializeAppSession";
import { getSessionType } from "../redux/session/selectors";
import Routes from "./Routes";

const Main: React.SFC<{}> = props => {
  const sessionType = useSelector(getSessionType);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (sessionType === "uninitialized") {
      dispatch(initializeAppSessionOperationFunc());
    }
  });

  switch (sessionType) {
    case "app":
      return <p>Logged In</p>;

    case "web":
      return <Routes />;

    case "uninitialized":
    case "initializing":
    default:
      return <Loading />;
  }
};

export default Main;
