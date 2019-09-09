import { Spin } from "antd";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { Dispatch } from "redux";
import { IUser } from "./models/user/user";
import netInterface from "./net/index";
import { clearState } from "./redux/actions";
import { loginUserRedux } from "./redux/session/actions";
import { getSignedInUser } from "./redux/session/selectors";
import { IReduxState } from "./redux/store";
import { addUserRedux } from "./redux/users/actions";
import Routes from "./Routes";

export interface IAppProps extends RouteComponentProps {
  user?: IUser;
  saveUserData: (user: IUser) => void;
  logOut: () => void;
}

class App extends React.Component<IAppProps> {
  public state = {
    ready: false,
    error: null
  };

  public async componentDidMount() {
    const { user, saveUserData, history, logOut } = this.props;

    if (!!!user) {
      try {
        const result = await netInterface("user.getSavedUserData");

        if (result && result.token) {
          saveUserData(result);
          this.setState({ ready: true }, () => {
            history.push("/app");
          });
        } else {
          this.setState({ ready: true });
        }
      } catch (error) {
        logOut();
        this.setState({ ready: true });
        // this.setState({ error });
      }
    } else {
      if (!window.location.pathname.includes("app")) {
        history.push("/app");
      }
    }
  }

  public componentDidUpdate() {
    const { user, history } = this.props;

    if (user) {
      if (!window.location.pathname.includes("app")) {
        history.push("/app");
      }
    }
  }

  public componentDidCatch(error) {
    this.setState({ error, ready: false });
  }

  public render() {
    const { ready, error } = this.state;

    if (error) {
      return (
        <div
          style={{
            height: "100%",
            padding: "2em",
            color: "red",
            fontWeight: "bold"
          }}
        >
          An error occurred.
        </div>
      );
    } else if (ready) {
      return <Routes />;
    } else {
      return (
        <Spin spinning={true} style={{ height: "100%" }}>
          <div style={{ height: "100%" }} />
        </Spin>
      );
    }
  }
}

function mapStateToProps(state: IReduxState) {
  return {
    user: getSignedInUser(state)
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    saveUserData(user) {
      dispatch(addUserRedux(user.user));
      dispatch(loginUserRedux(user.token, user.user.customId));
    },

    logOut() {
      dispatch(clearState());
      netInterface("user.logout");
    }
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
